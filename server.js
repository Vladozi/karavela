require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve from root

// // Serve static assets from proper directories
// app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));
// app.use('/js', express.static(path.join(__dirname, 'assets', 'js')));
// app.use('/img', express.static(path.join(__dirname, 'assets', 'img')));
// app.use('/scss', express.static(path.join(__dirname, 'assets', 'scss')));
// app.use('/vendor', express.static(path.join(__dirname, 'assets', 'vendor')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For development only, remove in production if you have valid certs
  }
});

// API Endpoints
app.post('/api/book-table', async (req, res) => {
  try {
    const { name, email, phone, date, time, people, message } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields' 
      });
    }

    // Email sending
    await transporter.sendMail({
      from: `"Restaurant Booking" <${process.env.GMAIL_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to: process.env.ORDER_EMAIL || "orderskaravela@gmail.com",
      subject: 'New Table Booking',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>People:</strong> ${people || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `
    });

    res.json({ status: 'success', message: 'Booking request sent' });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to send booking request',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill all required fields' 
      });
    }

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.ORDER_EMAIL || "orderskaravela@gmail.com",
      subject: `New Contact: ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

// Handle 404 and SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`Visit: http://localhost:${PORT}`);
  }
});