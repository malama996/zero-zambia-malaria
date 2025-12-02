const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const District = require('../models/District');
const User = require('../models/User');
const { assignLocation } = require('../utils/geo');
const { sendSMS } = require('../utils/sms');
const { authenticate, authorize } = require('../middleware/auth');
const { caseSubmissionLimiter } = require('../middleware/rateLimiter');
const { sendNewCaseNotification } = require('../utils/email');
const { logAction } = require('../utils/auditLog');

// POST /cases - Submit a new case (optional auth - can be anonymous or authenticated)
router.post('/cases', caseSubmissionLimiter, async (req, res) => {
  try {
    const { reporterName, reporterPhone, patientAge, patientGender, location, symptoms, rdtResult } = req.body;

    // Auto-assign district/province
    const { district, province } = await assignLocation(location.coordinates);

    const newCase = new Case({
      reporterName,
      reporterPhone,
      patientAge,
      patientGender,
      location,
      district,
      province,
      symptoms,
      rdtResult,
      reportedBy: req.user ? req.user._id : null // Link to user if authenticated
    });

    await newCase.save();

    // Log action
    await logAction(req, 'case_submitted', 'Case', newCase._id, {
      district,
      rdtResult,
      patientAge,
      patientGender
    });

    // Notify health professionals in the district (if positive case)
    if (rdtResult === 'Positive') {
      try {
        const healthProfessionals = await User.find({
          role: { $in: ['health_professional', 'admin'] },
          'notificationPreferences.emailNotifications': true
        });

        // Send notifications asynchronously (don't wait)
        healthProfessionals.forEach(hp => {
          sendNewCaseNotification(hp.email, hp.name, {
            district: newCase.district,
            patientAge: newCase.patientAge,
            patientGender: newCase.patientGender,
            rdtResult: newCase.rdtResult,
            createdAt: newCase.createdAt
          }).catch(err => console.error('Notification error:', err));
        });
      } catch (notifErr) {
        console.error('Error sending notifications:', notifErr);
        // Don't fail the request if notifications fail
      }
    }

    res.status(201).json({ message: 'Case submitted successfully', case: newCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /cases - Get all cases (health professionals see all, users see their own)
router.get('/cases', async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated and not a health professional, show only their cases
    if (req.user && req.user.role === 'user') {
      query.reportedBy = req.user._id;
    }
    // Health professionals and unauthenticated users see all cases
    
    const cases = await Case.find(query)
      .populate('reportedBy', 'name email')
      .populate('interventions.healthProfessional', 'name facility')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /cases/:id/intervene - Add intervention to a case (health professionals only)
router.post('/cases/:id/intervene', authenticate, authorize('health_professional', 'admin'), async (req, res) => {
  try {
    const { action, notes } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const caseDoc = await Case.findById(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Add intervention
    caseDoc.interventions.push({
      healthProfessional: req.user._id,
      action,
      notes
    });

    // Update status if needed
    if (caseDoc.status === 'pending') {
      caseDoc.status = 'investigating';
    }

    await caseDoc.save();

    // Log action
    await logAction(req, 'intervention_added', 'Case', caseDoc._id, {
      action,
      notes
    });

    // Populate the intervention details
    await caseDoc.populate('interventions.healthProfessional', 'name facility');

    res.json({ 
      message: 'Intervention added successfully', 
      case: caseDoc 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /outbreaks/generate - Detect outbreaks
router.get('/outbreaks/generate', async (req, res) => {
  try {
    // Logic: Compare last 14 days cases vs previous 14 days per district
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const currentPeriodCases = await Case.aggregate([
      { $match: { createdAt: { $gte: twoWeeksAgo } } },
      { $group: { _id: "$district", count: { $sum: 1 } } }
    ]);

    const previousPeriodCases = await Case.aggregate([
      { $match: { createdAt: { $gte: fourWeeksAgo, $lt: twoWeeksAgo } } },
      { $group: { _id: "$district", count: { $sum: 1 } } }
    ]);

    const outbreaks = [];
    currentPeriodCases.forEach(curr => {
      const prev = previousPeriodCases.find(p => p._id === curr._id) || { count: 0 };
      // Flag if > 50% increase and at least 5 cases
      if (curr.count > 5 && curr.count > prev.count * 1.5) {
        outbreaks.push({
          district: curr._id,
          currentCount: curr.count,
          previousCount: prev.count,
          increase: ((curr.count - prev.count) / prev.count) * 100
        });
      }
    });

    res.json(outbreaks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /sms/alert - Intelligent SMS alert
router.post('/sms/alert', async (req, res) => {
  try {
    const { messages, targetDistricts } = req.body;
    // messages: { en: "...", bem: "...", ... }
    // targetDistricts: ["Lusaka", "Ndola"]

    if (!messages || !targetDistricts || targetDistricts.length === 0) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 1. Determine dominant language for the first district (simplification)
    // In a complex app, we might group by language regions
    const dominantLanguage = require('../utils/languageMap').getDominantLanguage(targetDistricts[0]);

    // 2. Save Alert Record
    const newAlert = new require('../models/Alert')({
      messages,
      targetDistricts,
      dominantLanguage
    });
    await newAlert.save();

    // 3. Find Subscribers in these districts
    // Note: In a real app, we'd query Subscriber model. 
    // For this demo, we'll simulate sending to a list based on logic.
    const Subscriber = require('../models/Subscriber');
    const subscribers = await Subscriber.find({ district: { $in: targetDistricts } });

    // If no subscribers in DB, use mock for demonstration
    const recipientsList = subscribers.length > 0 ? subscribers : [
      { phoneNumber: '+260970000000', preferredLanguage: 'en' },
      { phoneNumber: '+260970000001', preferredLanguage: 'bem' }
    ];

    const results = [];
    
    // 4. Send messages
    for (const sub of recipientsList) {
      // Logic: Use user preference if available, else district dominant, else English
      const lang = sub.preferredLanguage || dominantLanguage || 'en';
      const messageContent = messages[lang] || messages['en'];

      if (messageContent) {
        const result = await sendSMS([sub.phoneNumber], messageContent);
        results.push({ phone: sub.phoneNumber, status: result, lang });
      }
    }

    res.json({ message: 'Alert processing complete', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'SMS failed' });
  }
});

module.exports = router;
