// api/webhook.js
const crypto = require('crypto');
const line = require('@line/bot-sdk');

/**
 * ENV on Vercel:
 * - LINE_CHANNEL_SECRET
 * - LINE_CHANNEL_ACCESS_TOKEN
 */

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

function validateSignature(rawBody, signature, channelSecret) {
  if (!signature || !channelSecret) return false;
  const hmac = crypto.createHmac('sha256', channelSecret);
  hmac.update(rawBody);
  const digest = hmac.digest('base64');
  return signature === digest;
}

/* ---------------------- Flex builders (generic) ---------------------- */
function messageAction(label, text) {
  // ใช้กับปุ่มที่ต้อง "ส่งข้อความ" เพื่อชน Auto‑Reply ของ OA
  return { type: 'message', label, text };
}

function postbackAction(label, data, displayText) {
  // ใช้สำหรับเมนูนำทาง (เช่น เลือกโครงการ → เปิดเมนูโครงการ)
  return { type: 'postback', label, data, displayText };
}

function uriAction(label, uri) {
  return { type: 'uri', label, uri };
}

function menuBubble(title, buttons) {
  return {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        { type: 'text', text: title, weight: 'bold', size: 'xl', wrap: true },
        { type: 'separator', margin: 'md' },
        ...buttons.map((btn) => ({
          type: 'button',
          style: btn.style || 'secondary',
          height: 'sm',
          color: btn.color || undefined,
          action: btn.action,
        })),
      ],
    },
  };
}

function flexMenuSingle(title, buttons) {
  return { type: 'flex', altText: title, contents: menuBubble(title, buttons) };
}

/* ---------------------- หน้าเลือกโครงการ (แนวตั้ง) ---------------------- */
function flexProjectMenu() {
  const title = 'เลือกโครงการที่ต้องการสอบถาม';
  const buttons = [
    { style: 'primary', color: '#2E86DE', action: postbackAction('โครงการ CI', 'project=CI', 'โครงการ CI') },
    { style: 'primary', color: '#10AC84', action: postbackAction('โครงการ PP', 'project=PP', 'โครงการ PP') },
    { style: 'primary', color: '#EE5253', action: postbackAction('โครงการ Model1', 'project=MODEL1', 'โครงการ Model1') },
    { style: 'primary', color: '#5F27CD', action: postbackAction('โครงการ MORDEE (OPD)', 'project=MORDEE_OPD', 'โครงการ MORDEE (OPD)') },
    { style: 'primary', color: '#FF9F43', action: postbackAction('โครงการ MORDEE (CI)', 'project=MORDEE_CI', 'โครงการ MORDEE (CI)') },
  ];
  return flexMenuSingle(title, buttons);
}

/* ---------------------- เมนูตามโครงการ (ดึง "อื่นๆ" มารวมหน้าเดียว) ---------------------- */

// ♥ โครงการ CI
function ciMainMenu() {
  const title = 'โครงการ CI : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: uriAction('1) วิธีการทำงาน', 'https://cpall.ekoapp.com?redirect_path=sub%2F636e11b41bb819003368432f&eko_action=open_library') },
    { style: 'primary', action: uriAction('2) รายการยา', 'https://docs.google.com/spreadsheets/d/1Qt_04wW02HLSqOcQ_qe5wlyFeKTZEaGaa6q2CdPHpqc/edit?usp=sharing') },
    { style: 'primary', action: uriAction('3) Set รายการยา TA Booster', 'https://docs.google.com/spreadsheets/d/1RoG9Pq2PpBWEfStZGCILjX3LBWwI-BIH/edit?usp=sharing&ouid=102635615160219209362&rtpof=true&sd=true') },
    { style: 'primary', action: uriAction('4) A‑Med', 'https://amed-care.hii.in.th') },
    { style: 'primary', action: uriAction('5) New Authen', 'https://authenservice.nhso.go.th/authencode') },
    { style: 'secondary', action: messageAction('6) แจ้งลบเตียงซ้ำ', 'แจ้งลบเตียงซ้ำ') },
    { style: 'secondary', action: messageAction('7) แจ้งพักบริการ', 'แจ้งพักบริการ') },
    { style: 'primary', action: uriAction('8) แจ้งลูกค้ามีปัญหา', 'https://forms.gle/b6LWSFiY7Jr6nrCc7') },
    { style: 'secondary', action: messageAction('9) แจ้งปัญหา Help Desk', 'Help desk') },
    { style: 'secondary', action: messageAction('10) ติดต่อทีมโครงการ', 'ติดต่อเจ้าหน้าที่') },
  ];
  return flexMenuSingle(title, buttons);
}

// ♥ โครงการ PP
function ppMainMenu() {
  const title = 'โครงการ PP : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: uriAction('1) วิธีการทำงาน', 'https://cpall.ekoapp.com?redirect_path=sub%2F617b6bdb733335002d570117&eko_action=open_library') },
    { style: 'secondary', action: messageAction('2) รายการยา', 'รายการยาโครงการPP') },
    { style: 'primary', action: uriAction('3) Krungthai Digital Health Platform', 'https://www.healthplatform.krungthai.com/healthPlatform/login') },
    { style: 'primary', action: uriAction('4) New Authen', 'https://authenservice.nhso.go.th/authencode') },
    { style: 'secondary', action: messageAction('5) แจ้งพักบริการ', 'แจ้งพักบริการ') },
    { style: 'primary', action: uriAction('6) แจ้งลูกค้ามีปัญหา', 'https://forms.gle/b6LWSFiY7Jr6nrCc7') },
    { style: 'secondary', action: messageAction('7) แจ้งปัญหา Help Desk', 'Help desk') },
    { style: 'secondary', action: messageAction('8) ติดต่อทีมโครงการ', 'ติดต่อเจ้าหน้าที่') },
  ];
  return flexMenuSingle(title, buttons);
}

// ♥ โครงการ Model1
function model1MainMenu() {
  const title = 'โครงการ Model1 : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: uriAction('1) วิธีการทำงาน', 'https://cpall.ekoapp.com?redirect_path=sub%2F617b6b712c5607002abf6ff4&eko_action=open_library') },
    { style: 'primary', action: uriAction('2) New Authen', 'https://authenservice.nhso.go.th/authencode') },
    { style: 'primary', action: uriAction('3) E-PRESCRIPT', 'https://eprescript.nhso.go.th/eprescriptui/login') },
    { style: 'secondary', action: messageAction('4) ไลน์กลุ่ม eXta Plus', 'ไลน์กลุ่ม Model1') },
    { style: 'secondary', action: messageAction('5) แจ้งปัญหา Help Desk', 'Help desk') },
    { style: 'secondary', action: messageAction('6) ติดต่อทีมโครงการ', 'ติดต่อเจ้าหน้าที่') },
  ];
  return flexMenuSingle(title, buttons);
}

// ♥ โครงการ MORDEE (OPD)
function mordeeOpdMainMenu() {
  const title = 'โครงการ MORDEE (OPD) : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: uriAction('1) วิธีการทำงาน', 'https://cpall.ekoapp.com?redirect_path=sub%2F67e115d4b3108d0021f43c99&eko_action=open_library') },
    { style: 'primary', action: uriAction('2) รายการยา', 'https://cpall.ekoapp.com?redirect_path=doc%2F686b31582f3e0033766d927f&eko_action=open_library') },
    { style: 'primary', action: uriAction('3) Username/Password/PIN', 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841') },
    { style: 'primary', action: uriAction('4) ระบบ OMS', 'https://oms-vendor.web.app/') },
    { style: 'secondary', action: messageAction('5) ที่อยู่ออกใบกำกับภาษี', 'ที่อยู่ออกใบกำกับภาษีหมอดี') },
    { style: 'secondary', action: messageAction('6) ตั้งค่าฉลากยา', 'ฉลากยาหมอดี') },
    { style: 'secondary', action: messageAction('7) ตั้งค่าโทรศัพท์เพื่อถ่ายรูป Upload Evidences', 'ตั้งค่าโทรศัพท์หมอดี') },
    { style: 'secondary', action: messageAction('8) LINE OA MORDEE', 'LineOA MORDEE') },
    { style: 'secondary', action: messageAction('9) แจ้งปัญหา Help Desk', 'Help desk') },
    { style: 'secondary', action: messageAction('10) ติดต่อทีมโครงการ', 'ติดต่อเจ้าหน้าที่') },
  ];
  return flexMenuSingle(title, buttons);
}

// ♥ โครงการ MORDEE (CI)
function mordeeCiMainMenu() {
  const title = 'โครงการ MORDEE (CI) : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: uriAction('1) วิธีการทำงาน', 'https://cpall.ekoapp.com?redirect_path=sub%2F6901c8d17cc77280e8f45e5f&eko_action=open_library') },
    { style: 'primary', action: uriAction('2) รายการยา', 'https://cpall.ekoapp.com?redirect_path=doc%2F6901cb837cc77251f0f46a55&eko_action=open_library') },
    { style: 'primary', action: uriAction('3) Username/Password/PIN', 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841') },
    { style: 'primary', action: uriAction('4) ระบบ OMS', 'https://oms-vendor.web.app/') },
    { style: 'secondary', action: messageAction('5) ที่อยู่ออกใบกำกับภาษี', 'ที่อยู่ออกใบกำกับภาษีหมอดี') },
    { style: 'secondary', action: messageAction('6) ตั้งค่าฉลากยา', 'ฉลากยาหมอดี') },
    { style: 'secondary', action: messageAction('7) ตั้งค่าโทรศัพท์เพื่อถ่ายรูป Upload Evidences', 'ตั้งค่าโทรศัพท์หมอดี') },
    { style: 'secondary', action: messageAction('8) LINE OA CI‑MORDEE', 'LineOA CI-MORDEE') },
    { style: 'secondary', action: messageAction('9) Dummy Code CI‑MORDEE', 'DummyCode CI-MORDEE') },
    { style: 'secondary', action: messageAction('10) แจ้งปัญหา Help Desk', 'Help desk') },
    { style: 'secondary', action: messageAction('11) ติดต่อทีมโครงการ', 'ติดต่อเจ้าหน้าที่') },
  ];
  return flexMenuSingle(title, buttons);
}

/* ---------------------- ตัวช่วยตอบกลับ ---------------------- */
function buildMenuByProject(project) {
  const p = (project || '').toUpperCase();
  if (p === 'CI') return ciMainMenu();
  if (p === 'PP') return ppMainMenu();
  if (p === 'MODEL1') return model1MainMenu();
  if (p === 'MORDEE_OPD') return mordeeOpdMainMenu();
  if (p === 'MORDEE_CI') return mordeeCiMainMenu();
  return null;
}

/* ---------------------- Handler ---------------------- */
module.exports = async (req, res) => {
  try {
    console.log(`[runtime] node=${process.version}`);

    if (req.method !== 'POST') {
      res.status(200).send('OK');
      return;
    }

    const rawBody = await getRawBody(req);
    const signature = req.headers['x-line-signature'];
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (!validateSignature(rawBody, signature, channelSecret)) {
      res.status(403).send('Invalid signature');
      return;
    }

    const body = JSON.parse(rawBody.toString('utf8'));
    const events = body.events || [];

    const results = await Promise.all(
      events.map(async (event) => {
        if (event.type === 'follow') {
          return client.replyMessage(
            event.replyToken,
            { type: 'text', text: 'สวัสดีค่ะ พิมพ์ "เลือกโครงการที่ต้องการสอบถาม" เพื่อเริ่มต้นนะคะ' }
          );
        }

        if (event.type === 'message' && event.message?.type === 'text') {
          const text = (event.message.text || '').trim();
          if (text === 'เลือกโครงการที่ต้องการสอบถาม') {
            return client.replyMessage(event.replyToken, flexProjectMenu());
          }
          // เงียบเพื่อให้ OA ทำ Auto‑Reply ตามคีย์เวิร์ดที่ตั้งไว้
          return Promise.resolve();
        }

        if (event.type === 'postback') {
          const data = event.postback?.data || '';
          const params = {};
          data.split('&').forEach((kv) => {
            const [k, v] = kv.split('=');
            if (k) params[k] = decodeURIComponent(v || '');
          });

          const project = params.project;
          const menu = buildMenuByProject(project);
          if (menu) return client.replyMessage(event.replyToken, menu);

          return client.replyMessage(event.replyToken, { type: 'text', text: 'ขออภัย ไม่พบคำสั่งที่ต้องการค่ะ' });
        }

        return Promise.resolve();
      })
    );

    res.status(200).json({ status: 'ok', results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Error');
  }
};
