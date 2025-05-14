require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');

// Basic middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root
app.use(express.urlencoded({ extended: true }));
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
    const { name, email, phone, date, time,people,message } = req.body;
    if (!name || !email || !phone || !date || !time || !people) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    await transporter.sendMail({
      from: `"შეკვეთა" <ladosichianva263@gmail.com>`,
      replyTo: `"${name}" <${email}>`,
      to: "orderskaravela@gmail.com",
      subject: 'ახალი შეკვეთა',
      html: `
      <h2>ახალი შეკვეთა</h2>
      <p><strong>სახელი:</strong> ${name}</p>
      <p><strong>მეილი:</strong> ${email}</p>
      <p><strong>მობილური:</strong> ${phone}</p>
      <p><strong>თარიღი:</strong> ${date}</p>
      <p><strong>დრო:</strong> ${time}</p>
      <p><strong>ხალხის რაოდენობა:</strong> ${people}</p>
      <p><strong>შეტყობინება:</strong> ${message || 'None'}</p>
    `
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message ,phone} = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    await transporter.sendMail({
      from: `"შეტყობინება" <ladosichianva263@gmail.com>`,
      replyTo: `"${name}" <${email}>`,
      to:  "orderskaravela@gmail.com",
      subject: 'ახალი შეტყობინება',
      html: `
      <h3>ახალი შეტყობინება</h3>
      <p><strong>სახელი:</strong> ${name}</p>
      <p><strong>მეილი:</strong> ${email}</p>
      <p><strong>ტელეფონი:</strong> ${phone}</p>
      <p><strong>შეტყობინება:</strong></p>
      <p>${message || 'არ არის მითითებული'}</p>
    `
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