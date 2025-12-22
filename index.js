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
  if (/^(โครงการหมอดี\\s*\\(\\s*สปสช\\s*\\)|หมอดี\\s*\\(\\s*สปสช\\s*\\)|สปสช)$/i.test(text)) return replyProjectTopics(event.replyToken, 'NHSO');

  // 3) เลือกหัวข้อแบบเจาะจง เช่น "CI วิธีการทำงาน", "PP รายการยา", "OPD ติดต่อเจ้าหน้าที่", "สปสช รายการยา" ฯลฯ
  const match = /^(CI|PP|OPD|สปสช)\\s+(วิธีการทำงาน|รายการยา|Incentive|ติดต่อเจ้าหน้าที่)$/i.exec(text);
  if (match) {
    const projKey = normalizeProjectKey(match[1]); // CI / PP / OPD / NHSO
    const topicKey = normalizeTopicKey(match[2]);  // WORKFLOW / DRUGS / INCENTIVE / CONTACT

    const url = getUrl(projKey, topicKey);
    if (!url) {
      return client.replyMessage(event.replyToken, [
        { type: 'text', text: `ยังไม่ได้ตั้งค่า URL สำหรับ "${match[1]} - ${match[2]}"` },
        { type: 'text', text: 'โปรดแจ้งผู้ดูแลระบบให้ตั้งค่า Environment Variables ให้ครบถ้วน' },
      ]);
    }
    return client.replyMessage(event.replyToken, [
      { type: 'text', text: `หัวข้อ: ${match[1]} - ${match[2]}` },
      { type: 'text', text: `ลิงก์ข้อมูล: ${url}` },
    ]);
  }

  // ค่าอื่น ๆ: แนะนำให้พิมพ์ "เมนู"
  return client.replyMessage(event.replyToken, [
    { type: 'text', text: 'กรุณาพิมพ์ "เมนู" เพื่อเริ่มเลือกโครงการ' },
  ]);
}

// --------------------- Helper Functions ---------------------

// เมนูโครงการ (Quick Reply)
function replyProjectMenu(replyToken) {
  return client.replyMessage(replyToken, [
    {
      type: 'text',
      text: 'โปรดเลือกโครงการที่ต้องการสอบถาม',
      quickReply: {
        items: [
          { type: 'action', action: { type: 'message', label: 'โครงการ CI', text: 'โครงการ CI' } },
          { type: 'action', action: { type: 'message', label: 'โครงการ PP', text: 'โครงการ PP' } },
          { type: 'action', action: { type: 'message', label: 'หมอดี (OPD)', text: 'โครงการหมอดี (OPD)' } },
          { type: 'action', action: { type: 'message', label: 'หมอดี (สปสช)', text: 'โครงการหมอดี (สปสช)' } },
        ],
      },
    },
  ]);
}

// ตัวเลือกหัวข้อย่อยของแต่ละโครงการ (Quick Reply + Flex Message ปุ่ม URI)
function replyProjectTopics(replyToken, projKey) {
  const { title, quickItems, flexButtons } = buildTopicsForProject(projKey);

  const messages = [
    {
      type: 'text',
      text: `โครงการ ${title}\nโปรดเลือกหัวข้อที่ต้องการ`,
      quickReply: { items: quickItems },
    },
    makeFlexBubble(`หัวข้อ - ${title}`, flexButtons),
  ];
  return client.replyMessage(replyToken, messages);
}

// ประกอบตัวเลือกแต่ละโครงการ
function buildTopicsForProject(projKey) {
  switch (projKey) {
    case 'CI':
      return {
        title: 'CI',
        quickItems: [
          qItem('CI วิธีการทำงาน'),
          qItem('CI รายการยา'),
          qItem('CI Incentive'),
          qItem('CI ติดต่อเจ้าหน้าที่'),
        ],
        flexButtons: [
          fBtn('วิธีการทำงาน', URLS.CI.WORKFLOW),
          fBtn('รายการยา', URLS.CI.DRUGS),
          fBtn('Incentive', URLS.CI.INCENTIVE),
          fBtn('ติดต่อเจ้าหน้าที่', URLS.CI.CONTACT),
        ],
      };
    case 'PP':
      return {
        title: 'PP',
        quickItems: [
          qItem('PP วิธีการทำงาน'),
          qItem('PP รายการยา'),
          qItem('PP ติดต่อเจ้าหน้าที่'),
        ],
        flexButtons: [
          fBtn('วิธีการทำงาน', URLS.PP.WORKFLOW),
          fBtn('รายการยา', URLS.PP.DRUGS),
          fBtn('ติดต่อเจ้าหน้าที่', URLS.PP.CONTACT),
        ],
      };
    case 'OPD':
      return {
        title: 'หมอดี (OPD)',
        quickItems: [
          qItem('OPD วิธีการทำงาน'),
          qItem('OPD รายการยา'),
          qItem('OPD ติดต่อเจ้าหน้าที่'),
        ],
        flexButtons: [
          fBtn('วิธีการทำงาน', URLS.OPD.WORKFLOW),
          fBtn('รายการยา', URLS.OPD.DRUGS),
          fBtn('ติดต่อเจ้าหน้าที่', URLS.OPD.CONTACT),
        ],
      };
    case 'NHSO':
      return {
        title: 'หมอดี (สปสช)',
        quickItems: [
          qItem('สปสช วิธีการทำงาน'),
          qItem('สปสช รายการยา'),
          qItem('สปสช ติดต่อเจ้าหน้าที่'),
        ],
        flexButtons: [
          fBtn('วิธีการทำงาน', URLS.NHSO.WORKFLOW),
          fBtn('รายการยา', URLS.NHSO.DRUGS),
          fBtn('ติดต่อเจ้าหน้าที่', URLS.NHSO.CONTACT),
        ],
      };
    default:
      return { title: projKey, quickItems: [], flexButtons: [] };
  }
}

// สร้าง Quick Reply item จากข้อความ
function qItem(text) {
  return { type: 'action', action: { type: 'message', label: text, text } };
}

// สร้าง Flex Button (URI) สำหรับเปิดลิงก์
function fBtn(label, url) {
  return {
    label,
    url: url || 'https://example.com/not-configured', // กันกรณีไม่ได้ตั้งค่า
  };
}

// สร้าง Flex Bubble จากรายการปุ่ม
function makeFlexBubble(title, buttons) {
  const contents = {
    type: 'bubble',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [{ type: 'text', text: title, weight: 'bold', size: 'lg' }],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: buttons.map((b) => ({
        type: 'button',
        style: 'primary',
        color: '#06C755',
        action: { type: 'uri', label: b.label, uri: b.url },
      })),
    },
  };
  return { type: 'flex', altText: title, contents };
}

// ทำให้ชื่อโครงการเป็น key ที่ใช้ใน URLS
function normalizeProjectKey(text) {
  if (/^CI$/i.test(text)) return 'CI';
  if (/^PP$/i.test(text)) return 'PP';
  if (/^OPD$/i.test(text)) return 'OPD';
  if (/^(สปสช)$/i.test(text)) return 'NHSO';
  return text;
}

// ทำให้ชื่อหัวข้อเป็น key ที่ใช้ใน URLS
function normalizeTopicKey(text) {
  if (/^(วิธีการทำงาน)$/i.test(text)) return 'WORKFLOW';
  if (/^(รายการยา)$/i.test(text)) return 'DRUGS';
  if (/^(Incentive)$/i.test(text)) return 'INCENTIVE';
  if (/^(ติดต่อเจ้าหน้าที่)$/i.test(text)) return 'CONTACT';
  return text;
}

// ดึง URL จากตาราง URLS
function getUrl(projKey, topicKey) {
  try {
    return URLS[projKey][topicKey] || null;
  } catch {
    return null;
  }
}

// Local run (Vercel จะ ignore app.listen)
app.listen(process.env.PORT || 3000, () =>
  console.log('Local server started on port', process.env.PORT || 3000)
);
