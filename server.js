  // Loads environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); 

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure SMTP using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


// Book a Table endpoint
app.post('/api/book-table', async (req, res) => {
  try {
    const { name, email, phone, date, time, people, message } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields' 
      });
    }

    await transporter.sendMail({
      from: `"Order" <ladosichianva263@gmail.com>`,
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

    res.json({ status: 'success', message: 'Booking request sent' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to send request' 
    });
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'გთხოვთ შეავსოთ ყველა საჭირო ველი' 
      });
    }

    await transporter.sendMail({
      from: `"Website Contact" <ladosichinava263@gmail.com>`,
      to: "orderskaravela@gmail.com",
      subject: `New Contact: ${name}`,
      html: `
        <h3>ახალი შეტყობინება</h3>
        <p><strong>სახელი:</strong> ${name}</p>
        <p><strong>მეილი:</strong> ${email}</p>
        <p><strong>ტელეფონი:</strong> ${phone}</p>
        <p><strong>შეტყობინება:</strong></p>
        <p>${message || 'არ არის მითითებული'}</p>
      `
    });

    res.json({ success: true, message: 'შეტყობინება გაიგზავნა!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'შეცდომა გაგზავნისას' 
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});