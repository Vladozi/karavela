require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');

// Basic middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Simple route handlers
app.post('/api/book-table', async (req, res) => {
  try {
    const { name, email, phone, date, time } = req.body;
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    await transporter.sendMail({
      to: process.env.ORDER_EMAIL,
      subject: 'New Booking',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    await transporter.sendMail({
      to: process.env.ORDER_EMAIL,
      subject: 'New Contact',
      text: message
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});