import express from 'express';
import 'dotenv/config'
import sgMail from '@sendgrid/mail';
import { authenticateToken } from './authMiddleware.js';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const router = express.Router();

router.post('/connect', authenticateToken, async (req, res) => {
  const { to, subject, text, html } = req.body;
  const userEmail = req.user.email;

  const msg = {
    to,
    from: process.env.EMAIL_FROM_ADDRESS,
    replyTo: userEmail,
    subject,
    text,
    html,
  };
  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Email not sent', error });
  }
});

export default router;
