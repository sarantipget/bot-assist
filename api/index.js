
// api/index.js
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

/** สร้าง Flex bubble ปุ่มใหญ่ */
function makeButtonsBubble(title, buttons) {
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        { type: 'text', text: title, weight: 'bold', size: 'lg', wrap: true },
        ...buttons.map((btn) => ({
          type: 'button',
          style: 'primary',
          height: 'sm',
          color: '#0367D3',
          action: btn.action,
        })),
      ],
    },
  };
}

/** เมนูหลัก */
function buildMainMenu() {
  const title = 'เลือกโครงการที่ต้องการสอบถาม';
  const buttons = [
    { label: 'โครงการ CI', action: { type: 'postback', label: 'โครงการ CI', data: 'action=select_project&project=CI' } },
    { label: 'โครงการ PP', action: { type: 'postback', label: 'โครงการ PP', data: 'action=select_project&project=PP' } },
    { label: 'โครงการ MORDEE (OPD)', action: { type: 'postback', label: 'MORDEE (OPD)', data: 'action=select_project&project=MORDEE_OPD' } },
    { label: 'โครงการ MORDEE (CI)', action: { type: 'postback', label: 'MORDEE (CI)', data: 'action=select_project&project=MORDEE_CI' } },
  ];
  return { type: 'flex', altText: 'เมนูหลัก', contents: makeButtonsBubble(title, buttons) };
}

/** เมนูโครงการ */
function buildProjectMenu(project) {
  switch (project) {
    case 'CI':
      return {
        type: 'flex',
        altText: 'โครงการ CI',
        contents: makeButtonsBubble('เลือกหัวข้อในโครงการ CI', [
          { label: 'วิธีการทำงาน', action: { type: 'uri', label: 'วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F636e11b41bb819003368432f&eko_action=open_library' } },
          { label: 'รายการยา', action: { type: 'uri', label: 'รายการยา', uri: 'https://docs.google.com/spreadsheets/d/1Qt_04wW02HLSqOcQ_qe5wlyFeKTZEaGaa6q2CdPHpqc/edit?usp=sharing' } },
          { label: 'อื่นๆ', action: { type: 'postback', label: 'อื่นๆ', data: 'action=select_submenu&project=CI&submenu=others' } },
          { label: 'ติดต่อเจ้าหน้าที่', action: { type: 'postback', label: 'ติดต่อเจ้าหน้าที่', data: 'action=select_submenu&project=CI&submenu=contact' } },
        ]),
      };
    case 'PP':
      return {
        type: 'flex',
        altText: 'โครงการ PP',
        contents: makeButtonsBubble('เลือกหัวข้อในโครงการ PP', [
          { label: 'วิธีการทำงาน', action: { type: 'uri', label: 'วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F617b6bdb733335002d570117&eko_action=open_library' } },
          { label: 'รายการยา', action: { type: 'postback', label: 'รายการยา', data: 'action=reply_text&text=รายการยาโครงการPP' } },
          { label: 'อื่นๆ', action: { type: 'postback', label: 'อื่นๆ', data: 'action=select_submenu&project=PP&submenu=others' } },
          { label: 'ติดต่อเจ้าหน้าที่', action: { type: 'postback', label: 'ติดต่อเจ้าหน้าที่', data: 'action=select_submenu&project=PP&submenu=contact' } },
        ]),
      };
    case 'MORDEE_OPD':
      return {
        type: 'flex',
        altText: 'โครงการ MORDEE (OPD)',
        contents: makeButtonsBubble('เลือกหัวข้อในโครงการ MORDEE (OPD)', [
          { label: 'วิธีการทำงาน', action: { type: 'uri', label: 'วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F67e115d4b3108d0021f43c99&eko_action=open_library' } },
          { label: 'รายการยา', action: { type: 'uri', label: 'รายการยา', uri: 'https://cpall.ekoapp.com?redirect_path=doc%2F686b31582f3e0033766d927f&eko_action=open_library' } },
          { label: 'Username/Password/PIN', action: { type: 'uri', label: 'Username/Password/PIN', uri: 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841' } },
          { label: 'อื่นๆ', action: { type: 'postback', label: 'อื่นๆ', data: 'action=select_submenu&project=MORDEE_OPD&submenu=others' } },
          { label: 'ติดต่อเจ้าหน้าที่', action: { type: 'postback', label: 'ติดต่อเจ้าหน้าที่', data: 'action=select_submenu&project=MORDEE_OPD&submenu=contact' } },
        ]),
      };
    case 'MORDEE_CI':
      return {
        type: 'flex',
        altText: 'โครงการ MORDEE (CI)',
        contents: makeButtonsBubble('เลือกหัวข้อในโครงการ MORDEE (CI)', [
          { label: 'วิธีการทำงาน', action: { type: 'uri', label: 'วิธีการทำงาน', uri: 'https://cpall.ekoapp.com?redirect_path=sub%2F6901c8d17cc77280e8f45e5f&eko_action=open_library' } },
          { label: 'รายการยา', action: { type: 'uri', label: 'รายการยา', uri: 'https://cpall.ekoapp.com?redirect_path=doc%2F6901cb837cc77251f0f46a55&eko_action=open_library' } },
          { label: 'Username/Password/PIN', action: { type: 'uri', label: 'Username/Password/PIN', uri: 'https://docs.google.com/spreadsheets/d/1K1pYCC80TF5oUd_JLmaTNfgjpcA28j9S6r6PqJ0hEmg/edit?gid=1247026841#gid=1247026841' } },
          { label: 'อื่นๆ', action: { type: 'postback', label: 'อื่นๆ', data: 'action=select_submenu&project=MORDEE_CI&submenu=others' } },
          { label: 'ติดต่อเจ้าหน้าที่', action: { type: 'postback', label: 'ติดต่อเจ้าหน้าที่', data: 'action=select_submenu&project=MORDEE_CI&submenu=contact' } },
        ]),
      };
    default:
      return buildMainMenu();
  }
}

/** เมนูอื่นๆ */
function buildOthersMenu(project) {
  if (project === 'CI') {
    const bubble1 = makeButtonsBubble('CI : อื่นๆ (หน้า 1/2)', [
      { label: 'A-Med', action: { type: 'uri', label: 'A-Med', uri: 'https://amed-care.hii.in.th' } },
      { label: 'New Authen', action: { type: 'uri', label: 'New Authen', uri: 'https://authenservice.nhso.go.th/authencode' } },
      { label: 'Smart Card Reder', action: { type: 'uri', label: 'Smart Card Reder', uri: 'https://drive.google.com/drive/u/0/folders/1pzufTBHUiiILhp2qviBcxetIg0JuoaZj' } },
      { label: 'แจ้งลูกค้ามีปัญหา', action: { type: 'uri', label: 'แจ้งลูกค้ามีปัญหา', uri: 'https://forms.gle/b6LWSFiY7Jr6nrCc7' } },
    ]);
    const bubble2 = makeButtonsBubble('CI : อื่นๆ (หน้า 2/2)', [
      { label: 'แจ้งลบเตียงซ้ำ', action: { type: 'postback', label: 'แจ้งลบเตียงซ้ำ', data: 'action=reply_text&text=แจ้งลบเตียงซ้ำ' } },
      { label: 'แจ้งพักบริการCI', action: { type: 'postback', label: 'แจ้งพักบริการCI', data: 'action=reply_text&text=แจ้งพักบริการCI' } },
      { label: 'TA Booster: Set รายการยา', action: { type: 'uri', label: 'TA Booster', uri: 'https://docs.google.com/spreadsheets/d/1RoG9Pq2PpBWEfStZGCILjX3LBWwI-BIH/edit?usp=sharing&ouid=102635615160219209362&rtpof=true&sd=true' } },
      { label: 'กลับเมนู CI', action: { type: 'postback', label: 'กลับเมนู CI', data: 'action=select_project&project=CI' } },
    ]);
    return { type: 'flex', altText: 'CI : อื่นๆ', contents: { type: 'carousel', contents: [bubble1, bubble2] } };
  }

  if (project === 'PP') {
    const bubble = makeButtonsBubble('PP : อื่นๆ', [
      { label: 'Krungthai Digital Health Platform', action: { type: 'uri', label: 'Krungthai DHP', uri: 'https://www.healthplatform.krungthai.com/healthPlatform/login' } },
      { label: 'New Authen', action: { type: 'uri', label: 'New Authen', uri: 'https://authenservice.nhso.go.th/authencode' } },
      { label: 'Smart Card Reder', action: { type: 'uri', label: 'Smart Card Reder', uri: 'https://drive.google.com/drive/u/0/folders/1pzufTBHUiiILhp2qviBcxetIg0JuoaZj' } },
      { label: 'แจ้งลูกค้ามีปัญหา', action: { type: 'uri', label: 'แจ้งลูกค้ามีปัญหา', uri: 'https://forms.gle/b6LWSFiY7Jr6nrCc7' } },
    ]);
    return { type: 'flex', altText: 'PP : อื่นๆ', contents: bubble };
  }

  if (project === 'MORDEE_OPD') {
    const bubble = makeButtonsBubble('MORDEE (OPD) : อื่นๆ', [
      { label: 'เข้าระบบ OMS', action: { type: 'uri', label: 'OMS', uri: 'https://oms-vendor.web.app/' } },
      { label: 'ที่อยู่ออกใบกำกับภาษี', action: { type: 'postback', label: 'ที่อยู่ออกใบกำกับภาษี', data: 'action=reply_text&text=ที่อยู่ออกใบกำกับภาษีหมอดี' } },
      { label: 'ตั้งค่าฉลากยา', action: { type: 'postback', label: 'ตั้งค่าฉลากยา', data: 'action=reply_text&text=ฉลากยาหมอดี' } },
      { label: 'ตั้งค่าโทรศัพท์ Upload Evidences', action: { type: 'postback', label: 'ตั้งค่าโทรศัพท์', data: 'action=reply_text&text=ตั้งค่าโทรศัพท์หมอดี' } },
      { label: 'LINE OA MORDEE', action: { type: 'postback', label: 'LINE OA MORDEE', data: 'action=reply_text&text=LineOA MORDEE' } },
      { label: 'กลับเมนู MORDEE (OPD)', action: { type: 'postback', label: 'กลับเมนู', data: 'action=select_project&project=MORDEE_OPD' } },
    ]);
    return { type: 'flex', altText: 'MORDEE (OPD) : อื่นๆ', contents: bubble };
  }

  if (project === 'MORDEE_CI') {
    const bubble = makeButtonsBubble('MORDEE (CI) : อื่นๆ', [
      { label: 'เข้าระบบ OMS', action: { type: 'uri', label: 'OMS', uri: 'https://oms-vendor.web.app/' } },
      { label: 'ที่อยู่ออกใบกำกับภาษี', action: { type: 'postback', label: 'ที่อยู่ออกใบกำกับภาษี', data: 'action=reply_text&text=ที่อยู่ออกใบกำกับภาษีหมอดี' } },
      { label: 'ตั้งค่าฉลากยา', action: { type: 'postback', label: 'ตั้งค่าฉลากยา', data: { type: 'postback', label: 'ตั้งค่าฉลากยา', data: 'action=reply_text&text=ฉลากยาหมอดี' } } },
      { label: 'ตั้งค่าโทรศัพท์ Upload Evidences', action: { type: 'postback', label: 'ตั้งค่าโทรศัพท์', data: 'action=reply_text&text=ตั้งค่าโทรศัพท์หมอดี' } },
      { label: 'LINE OA CI-MORDEE', action: { type: 'postback', label: 'LINE OA CI-MORDEE', data: 'action=reply_text&text=LineOA CI-MORDEE' } },
      { label: 'Dummy Code CI-MORDEE', action: { type: 'postback', label: 'Dummy Code', data: 'action=reply_text&text=DummyCode CI-MORDEE' } },
      { label: 'กลับเมนู MORDEE (CI)', action: { type: 'postback', label: 'กลับเมนู', data: 'action=select_project&project=MORDEE_CI' } },
    ]);
    return { type: 'flex', altText: 'MORDEE (CI) : อื่นๆ', contents: bubble };
  }

  return buildMainMenu();
}

/** parse postback.data */
function parseData(data) {
  return Object.fromEntries(
    String(data)
      .split('&')
      .map((kv) => {
        const [k, v] = kv.split('=');
        return [k, decodeURIComponent(v || '')];
      }),
  );
}

function replyText(replyToken, text) {
  return client.replyMessage(replyToken, { type: 'text', text });
}

/** Handler */
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(200).json({ ok: true, message: 'LINE Webhook ready', hint: 'POST events to this endpoint.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { /* ignore */ }
    }
    if (!body || !body.events) {
      return res.status(400).json({ ok: false, error: 'Invalid webhook body (no events)' });
    }

    const results = await Promise.all(
      body.events.map(async (event) => {
        if (event.type === 'message' && event.message?.type === 'text') {
          return client.replyMessage(event.replyToken, buildMainMenu());
        }
        if (event.type === 'postback' && event.postback?.data) {
          const data = parseData(event.postback.data);
          if (data.action === 'reply_text' && data.text) return replyText(event.replyToken, data.text);
          if (data.action === 'select_project' && data.project) return client.replyMessage(event.replyToken, buildProjectMenu(data.project));
          if (data.action === 'select_submenu' && data.project && data.submenu) {
            if (data.submenu === 'others') return client.replyMessage(event.replyToken, buildOthersMenu(data.project));
            if (data.submenu === 'contact') return replyText(event.replyToken, 'ติดต่อเจ้าหน้าที่');
          }
          return client.replyMessage(event.replyToken, buildMainMenu());
        }
        return client.replyMessage(event.replyToken, buildMainMenu());
      }),
    );

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
