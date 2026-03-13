// send-daily-reminders.js
// Sends daily reminder emails to all signed-up users

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const EMAILS_PATH = path.join(__dirname, 'daily-reminder-emails.txt');

// Configure your email transport (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const subject = 'Mentally Prepare: Daily Reminder';
const text = 'Take 5 minutes today to write your journal entry. Your prompt is waiting!';

function sendReminders() {
  if (!fs.existsSync(EMAILS_PATH)) return;
  const emails = fs.readFileSync(EMAILS_PATH, 'utf8').split('\n').map(e => e.trim()).filter(Boolean);
  emails.forEach(email => {
    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      text
    }, (err, info) => {
      if (err) {
        console.error('Failed to send to', email, err);
      } else {
        console.log('Sent reminder to', email);
      }
    });
  });
}

// Run this script once per day (e.g., via cron)
sendReminders();
