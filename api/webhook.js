// api/webhook.js
const crypto = require('crypto');
const line = require('@line/bot-sdk');

/**
 * ต้องตั้งค่า ENV บน Vercel:
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

// ---------- Flex builders ----------
function flexProjectMenu() {
  return {
    type: 'flex',
    altText: 'เลือกโครงการที่ต้องการสอบถาม',
    contents: {
      type: 'carousel',
      contents: [
        projectBubble('โครงการ CI', 'CI', '#2E86DE'),
        projectBubble('โครงการ PP', 'PP', '#10AC84'),
        projectBubble('โครงการ Model1', 'MODEL1', '#EE5253'),
        projectBubble('โครงการ MORDEE (OPD)', 'MORDEE_OPD', '#5F27CD'),
        projectBubble('โครงการ MORDEE (CI)', 'MORDEE_CI', '#FF9F43'),
      ],
    },
  };
}

function projectBubble(title, key, color = '#2E86DE') {
  return {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'lg',
      contents: [
        { type: 'text', text: title, weight: 'bold', size: 'xl', wrap: true },
        { type: 'separator', margin: 'md' },
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color,
              height: 'md',
              action: {
                type: 'postback',
                label: 'เลือกหัวข้อ',
                data: `project=${key}`,
                displayText: title,
              },
            },
          ],
        },
      ],
    },
  };
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

// ---------- Menus per project ----------
function ciMainMenu() {
  const title = 'โครงการ CI : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: '1) วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F636e11b41bb819003368432f&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '2) รายการยา', uri: 'https://docs.google.com/spreadsheets/d/1Qt_04wW02HLSqOcQ_qe5wlyFeKTZEaGaa6q2CdPHpqc/edit?usp=sharing' } },
    { style: 'secondary', action: { type: 'postback', label: '3) อื่นๆ', data: 'project=CI&topic=other', displayText: 'โครงการ CI : อื่นๆ' } },
    { style: 'secondary', action: { type: 'postback', label: '4) แจ้งปัญหา Help Desk', data: 'project=CI&topic=helpdesk', displayText: 'Help desk' } },
    { style: 'secondary', action: { type: 'postback', label: '5) ติดต่อทีมโครงการ', data: 'project=CI&topic=contact', displayText: 'ติดต่อเจ้าหน้าที่' } },
  ];
  return flexMenuSingle(title, buttons);
}

function ciOtherMenu() {
  const title = 'โครงการ CI : อื่นๆ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: 'A‑Med', uri: 'https://amed-care.hii.in.th' } },
    { style: 'primary', action: { type: 'uri', label: 'New Authen', uri: 'https://authenservice.nhso.go.th/authencode' } },
    { style: 'primary', action: { type: 'uri', label: 'แจ้งลูกค้ามีปัญหา', uri: 'https://forms.gle/b6LWSFiY7Jr6nrCc7' } },
    { style: 'secondary', action: { type: 'postback', label: 'แจ้งลบเตียงซ้ำ', data: 'project=CI&topic=dupbed', displayText: 'แจ้งลบเตียงซ้ำ' } },
    { style: 'secondary', action: { type: 'postback', label: 'แจ้งพักบริการ', data: 'project=CI&topic=hold', displayText: 'แจ้งพักบริการ' } },
    { style: 'primary', action: { type: 'uri', label: 'Set รายการยา TA Booster', uri: 'https://docs.google.com/spreadsheets/d/1RoG9Pq2PpBWEfStZGCILjX3LBWwI-BIH/edit?usp=sharing&ouid=102635615160219209362&rtpof=true&sd=true' } },
  ];
  return flexMenuSingle(title, buttons);
}

function ppMainMenu() {
  const title = 'โครงการ PP : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: '1) วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F617b6bdb733335002d570117&eko_action=open_library' } },
    { style: 'secondary', action: { type: 'postback', label: '2) รายการยา', data: 'project=PP&topic=druglist', displayText: 'รายการยาโครงการPP' } },
    { style: 'secondary', action: { type: 'postback', label: '3) อื่นๆ', data: 'project=PP&topic=other', displayText: 'โครงการ PP : อื่นๆ' } },
    { style: 'secondary', action: { type: 'postback', label: '4) แจ้งปัญหา Help Desk', data: 'project=PP&topic=helpdesk', displayText: 'Help desk' } },
    { style: 'secondary', action: { type: 'postback', label: '5) ติดต่อทีมโครงการ', data: 'project=PP&topic=contact', displayText: 'ติดต่อเจ้าหน้าที่' } },
  ];
  return flexMenuSingle(title, buttons);
}

function ppOtherMenu() {
  const title = 'โครงการ PP : อื่นๆ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: 'Krungthai Digital Health Platform', uri: 'https://www.healthplatform.krungthai.com/healthPlatform/login' } },
    { style: 'primary', action: { type: 'uri', label: 'New Authen', uri: 'https://authenservice.nhso.go.th/authencode' } },
    { style: 'primary', action: { type: 'uri', label: 'แจ้งลูกค้ามีปัญหา', uri: 'https://forms.gle/b6LWSFiY7Jr6nrCc7' } },
    { style: 'secondary', action: { type: 'postback', label: 'แจ้งพักบริการ', data: 'project=PP&topic=hold', displayText: 'แจ้งพักบริการ' } },
  ];
  return flexMenuSingle(title, buttons);
}

function model1MainMenu() {
  const title = 'โครงการ Model1 : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: '1) วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F617b6b712c5607002abf6ff4&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '2) New Authen', uri: 'https://authenservice.nhso.go.th/authencode' } },
    { style: 'primary', action: { type: 'uri', label: '3) E-PRESCRIPT', uri: 'https://eprescript.nhso.go.th/eprescriptui/login' } },
    { style: 'secondary', action: { type: 'postback', label: '4) ไลน์กลุ่ม eXta Plus', data: 'project=MODEL1&topic=linegroup', displayText: 'ไลน์กลุ่ม Model1' } },
    { style: 'secondary', action: { type: 'postback', label: '5) แจ้งปัญหา Help Desk', data: 'project=MODEL1&topic=helpdesk', displayText: 'Help desk' } },
    { style: 'secondary', action: { type: 'postback', label: '6) ติดต่อทีมโครงการ', data: 'project=MODEL1&topic=contact', displayText: 'ติดต่อเจ้าหน้าที่' } },
  ];
  return flexMenuSingle(title, buttons);
}

function mordeeOpdMainMenu() {
  const title = 'โครงการ MORDEE (OPD) : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: '1) วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F67e115d4b3108d0021f43c99&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '2) รายการยา', uri: 'https://cpall.ekoapp.com?redirect_path=doc%2F686b31582f3e0033766d927f&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '3) Username/Password/PIN', uri: 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841' } },
    { style: 'secondary', action: { type: 'postback', label: '4) อื่นๆ', data: 'project=MORDEE_OPD&topic=other', displayText: 'MORDEE (OPD) : อื่นๆ' } },
    { style: 'secondary', action: { type: 'postback', label: '5) แจ้งปัญหา Help Desk', data: 'project=MORDEE_OPD&topic=helpdesk', displayText: 'Help desk' } },
    { style: 'secondary', action: { type: 'postback', label: '6) ติดต่อทีมโครงการ', data: 'project=MORDEE_OPD&topic=contact', displayText: 'ติดต่อเจ้าหน้าที่' } },
  ];
  return flexMenuSingle(title, buttons);
}

function mordeeOpdOtherMenu() {
  const title = 'MORDEE (OPD) : อื่นๆ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: 'เข้าระบบ OMS', uri: 'https://oms-vendor.web.app/' } },
    { style: 'secondary', action: { type: 'postback', label: 'ที่อยู่ออกใบกำกับภาษี', data: 'project=MORDEE_OPD&topic=taxaddr', displayText: 'ที่อยู่ออกใบกำกับภาษีหมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'ตั้งค่าฉลากยา', data: 'project=MORDEE_OPD&topic=label', displayText: 'ฉลากยาหมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'ตั้งค่าโทรศัพท์ (Upload Evidences)', data: 'project=MORDEE_OPD&topic=phone', displayText: 'ตั้งค่าโทรศัพท์หมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'LINE OA MORDEE', data: 'project=MORDEE_OPD&topic=lineoa', displayText: 'LineOA MORDEE' } },
  ];
  return flexMenuSingle(title, buttons);
}

function mordeeCiMainMenu() {
  const title = 'โครงการ MORDEE (CI) : เลือกหัวข้อ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: '1) วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F6901c8d17cc77280e8f45e5f&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '2) รายการยา', uri: 'https://cpall.ekoapp.com?redirect_path=doc%2F6901cb837cc77251f0f46a55&eko_action=open_library' } },
    { style: 'primary', action: { type: 'uri', label: '3) Username/Password/PIN', uri: 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841' } },
    { style: 'secondary', action: { type: 'postback', label: '4) อื่นๆ', data: 'project=MORDEE_CI&topic=other', displayText: 'MORDEE (CI) : อื่นๆ' } },
    { style: 'secondary', action: { type: 'postback', label: '5) แจ้งปัญหา Help Desk', data: 'project=MORDEE_CI&topic=helpdesk', displayText: 'Help desk' } },
    { style: 'secondary', action: { type: 'postback', label: '6) ติดต่อทีมโครงการ', data: 'project=MORDEE_CI&topic=contact', displayText: 'ติดต่อเจ้าหน้าที่' } },
  ];
  return flexMenuSingle(title, buttons);
}

function mordeeCiOtherMenu() {
  const title = 'MORDEE (CI) : อื่นๆ';
  const buttons = [
    { style: 'primary', action: { type: 'uri', label: 'เข้าระบบ OMS', uri: 'https://oms-vendor.web.app/' } },
    { style: 'secondary', action: { type: 'postback', label: 'ที่อยู่ออกใบกำกับภาษี', data: 'project=MORDEE_CI&topic=taxaddr', displayText: 'ที่อยู่ออกใบกำกับภาษีหมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'ตั้งค่าฉลากยา', data: 'project=MORDEE_CI&topic=label', displayText: 'ฉลากยาหมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'ตั้งค่าโทรศัพท์ (Upload Evidences)', data: 'project=MORDEE_CI&topic=phone', displayText: 'ตั้งค่าโทรศัพท์หมอดี' } },
    { style: 'secondary', action: { type: 'postback', label: 'LINE OA CI‑MORDEE', data: 'project=MORDEE_CI&topic=lineoa', displayText: 'LineOA CI-MORDEE' } },
    { style: 'secondary', action: { type: 'postback', label: 'Dummy Code CI‑MORDEE', data: 'project=MORDEE_CI&topic=dummy', displayText: 'DummyCode CI-MORDEE' } },
  ];
  return flexMenuSingle(title, buttons);
}

// ---------- Reply helpers ----------
function textMessage(text) {
  return { type: 'text', text };
}

function resolveTextByPostback(project, topic) {
  const p = (project || '').toUpperCase();
  const t = (topic || '').toLowerCase();

  if (t === 'helpdesk') return 'Help desk';
  if (t === 'contact') return 'ติดต่อเจ้าหน้าที่';

  if (p === 'PP' && t === 'druglist') return 'รายการยาโครงการPP';
  if (p === 'CI' && t === 'dupbed') return 'แจ้งลบเตียงซ้ำ';
  if ((p === 'CI' || p === 'PP') && t === 'hold') return 'แจ้งพักบริการ';

  if ((p === 'MORDEE_OPD' || p === 'MORDEE_CI') && t === 'taxaddr') return 'ที่อยู่ออกใบกำกับภาษีหมอดี';
  if ((p === 'MORDEE_OPD' || p === 'MORDEE_CI') && t === 'label') return 'ฉลากยาหมอดี';
  if ((p === 'MORDEE_OPD' || p === 'MORDEE_CI') && t === 'phone') return 'ตั้งค่าโทรศัพท์หมอดี';
  if (p === 'MORDEE_OPD' && t === 'lineoa') return 'LineOA MORDEE';
  if (p === 'MORDEE_CI' && t === 'lineoa') return 'LineOA CI-MORDEE';
  if (p === 'MORDEE_CI' && t === 'dummy') return 'DummyCode CI-MORDEE';
  if (p === 'MODEL1' && t === 'linegroup') return 'ไลน์กลุ่ม Model1';

  return null;
}

function buildMenuByProject(project, topic) {
  const p = (project || '').toUpperCase();
  const t = (topic || '').toLowerCase();

  if (p === 'CI') {
    if (t === 'other') return ciOtherMenu();
    return ciMainMenu();
  }
  if (p === 'PP') {
    if (t === 'other') return ppOtherMenu();
    return ppMainMenu();
  }
  if (p === 'MODEL1') return model1MainMenu();
  if (p === 'MORDEE_OPD') {
    if (t === 'other') return mordeeOpdOtherMenu();
    return mordeeOpdMainMenu();
  }
  if (p === 'MORDEE_CI') {
    if (t === 'other') return mordeeCiOtherMenu();
    return mordeeCiMainMenu();
  }
  return null;
}

// ---------- Handler ----------
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
            textMessage('สวัสดีค่ะ พิมพ์ "เลือกโครงการที่ต้องการสอบถาม" เพื่อเริ่มต้นนะคะ')
          );
        }

        if (event.type === 'message' && event.message?.type === 'text') {
          const text = (event.message.text || '').trim();
          if (text === 'เลือกโครงการที่ต้องการสอบถาม') {
            return client.replyMessage(event.replyToken, flexProjectMenu());
          }
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
          const topic = params.topic;

          const textResp = resolveTextByPostback(project, topic);
          if (textResp) return client.replyMessage(event.replyToken, textMessage(textResp));

          const menu = buildMenuByProject(project, topic);
          if (menu) return client.replyMessage(event.replyToken, menu);

          return client.replyMessage(event.replyToken, textMessage('ขออภัย ไม่พบคำสั่งที่ต้องการค่ะ'));
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
