# 🚀 Quick Start Guide

## Zero Malaria Zambia | MapTrack

### ⚡ 5-Minute Setup

#### Step 1: Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run seed
npm run dev
```
✅ You should see: "Server running on port 5000" and "MongoDB Connected"

#### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
✅ You should see: "Local: http://localhost:5173"

#### Step 3: Open Browser
1. Go to **http://localhost:5173**
2. Click **❓ Help** button to see the welcome guide
3. Allow location access when prompted

---

## 📖 User Guide

### For Community Health Workers

**Submitting a Case:**
1. Click "Submit Case" tab (bottom navigation)
2. Fill in:
   - Your name and phone
   - Patient age and gender
   - Symptoms (comma-separated)
   - RDT Result (Positive/Negative)
3. Wait for GPS lock (green indicator)
4. Click "Submit Report"
5. ✅ Success message appears

### For Health Officials

**Viewing Dashboard:**
1. Click "Dashboard" tab
2. See key stats:
   - Total cases
   - Active outbreaks
   - Positive rate
   - Last 24h cases
3. View charts:
   - 7-day trend line
   - District breakdown
4. Send SMS alerts for outbreaks

**Viewing Map:**
1. Click "Alert Map" tab
2. Red markers = Positive cases
3. Green markers = Negative cases
4. Click markers for details
5. Legend bottom-right shows counts

---

## 🌍 Language Switching

1. Click the language dropdown (top right)
2. Select your language
3. UI updates instantly

Currently supported:
- English
- Icibemba (Bemba) - Full translation
- Cinyanja, Chitonga, Silozi, etc. - Ready for translation

---

## 🔧 Troubleshooting

### Map Not Showing
- Check browser console (F12) for errors
- Verify backend is running on port 5000
- Refresh the page

### GPS Not Working
- Allow location permission in browser
- Use HTTPS in production (required for GPS)
- Check if location services are enabled

### Charts Not Displaying
- Verify `chart.js` and `react-chartjs-2` are installed:
  ```bash
  cd frontend
  npm list chart.js react-chartjs-2
  ```

### Can't See Welcome Screen
- Click the **❓ Help** button (top right)
- Or clear localStorage: `localStorage.clear()` in console

### SMS Not Sending
- This requires Africa's Talking API credentials
- Currently in mock mode - check backend console logs
- Add your API key to `backend/.env`

---

## 💡 Tips

1. **Offline Mode**: The app works offline! Try submitting a case with network off.
2. **Install as App**: Click the install icon in your browser to add to home screen.
3. **Mobile**: Best experienced on mobile devices for field work.
4. **Help Anytime**: Click ❓ Help button to see the welcome guide again.

---

## 🎯 Test the App

### Create Test Data

1. **Submit 3-5 Cases**:
   - Mix of Positive and Negative
   - Different locations (if possible use VPN or mock GPS)
   - Different dates

2. **View Map**:
   - Should see markers appear
   - Click them to verify data

3. **Check Dashboard**:
   - Stats should update
   - Charts should render
   - Try sending an SMS alert

### Expected Behavior

✅ Form clears after successful submission
✅ Map shows new markers immediately
✅ Dashboard stats update in real-time
✅ Language switch updates all UI text
✅ GPS lock indicator shows green when ready

---

## 📞 Need Help?

- Check the main README.md for detailed docs
- Open the browser console (F12) to see any errors
- Verify both backend and frontend are running
- Check that MongoDB is running

**Built for Zero Malaria Zambia 🦟**
