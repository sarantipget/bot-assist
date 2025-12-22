
import express from 'express';
import { middleware, Client } from '@line/bot-sdk';

/**
 * อ่านค่าจาก Environment Variables
 * ต้องตั้งใน Vercel (Project → Settings → Environment Variables) หรือในเครื่องตอนทดสอบ
 * CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN และ URL ต่าง ๆ ของแต่ละหัวข้อ/โครงการ
 */
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
const client = new Client(config);

// --- URLs สำหรับลิงก์ตอบกลับ (ตั้งค่าเป็น Environment Variables) ---
const URLS = {
  CI: {
    WORKFLOW: process.env.CI_WORKFLOW_URL,
    DRUGS: process.env.CI_DRUGS_URL,
    INCENTIVE: process.env.CI_INCENTIVE_URL,
    CONTACT: process.env.CI_CONTACT_URL,
  },
  PP: {
    WORKFLOW: process.env.PP_WORKFLOW_URL,
    DRUGS: process.env.PP_DRUGS_URL,
    CONTACT: process.env.PP_CONTACT_URL,
  },
  OPD: {
    WORKFLOW: process.env.OPD_WORKFLOW_URL,
    DRUGS: process.env.OPD_DRUGS_URL,
    CONTACT: process.env.OPD_CONTACT_URL,
  },
  NHSO: {
    WORKFLOW: process.env.NHSO_WORKFLOW_URL,
    DRUGS: process.env.NHSO_DRUGS_URL,
    CONTACT: process.env.NHSO_CONTACT_URL,
  },
};

const app = express();

// Health check
app.get('/', (req, res) => res.send('LINE Bot is running'));

// Webhook (มี middleware ของ @line/bot-sdk ช่วยตรวจลายเซ็น X-Line-Signature)
app.post('/webhook', middleware({ channelSecret: config.channelSecret }), async (req, res) => {
  const events = req.body.events || [];
  await Promise.all(events.map(handleEvent));
  res.status(200).end();
});

// --------------------- Event Handler ---------------------
async function handleEvent(event) {
  // รองรับเฉพาะข้อความ
  if (event.type !== 'message' || event.message?.type !== 'text') {
    return Promise.resolve('ignored');
  }

  const text = (event.message.text || '').trim();

  // 1) เมนูเริ่มต้น
  if (/^(เมนู|โครงการ|เริ่ม|help|ช่วยเหลือ)$/i.test(text)) {
    return replyProjectMenu(event.replyToken);
  }

  // 2) เลือกโครงการ
  // รองรับทั้งชื่อเต็มและย่อ
  if (/^(โครงการ\\s*CI|CI)$/i.test(text)) return replyProjectTopics(event.replyToken, 'CI');
  if (/^(โครงการ\\s*PP|PP)$/i.test(text)) return replyProjectTopics(event.replyToken, 'PP');
  if (/^(โครงการหมอดี\\s*\\(\\s*OPD\\s*\\)|หมอดี\\s*\\(\\s*OPD\\s*\\)|OPD)$/i.test(text)) return replyProjectTopics(event.replyToken, 'OPD');
