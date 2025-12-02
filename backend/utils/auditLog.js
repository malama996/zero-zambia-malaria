const AuditLog = require('../models/AuditLog');

// Create audit log entry
exports.logAction = async (req, action, resource = null, resourceId = null, details = {}) => {
  try {
    await AuditLog.create({
      user: req.user ? req.user._id : null,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw error - logging should not break the main flow
  }
};

// Middleware to log actions
exports.auditMiddleware = (action, resource = null) => {
  return async (req, res, next) => {
    // Store original send
    const originalSend = res.send;
    
    // Override send
    res.send = function(data) {
      // Log only on successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        exports.logAction(req, action, resource, req.params.id, {
          method: req.method,
          path: req.path,
          body: req.body
        }).catch(err => console.error('Audit log error:', err));
      }
      
      // Call original send
      originalSend.call(this, data);
    };
    
    next();
  };
};
