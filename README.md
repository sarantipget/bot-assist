# LINE Bot Project (CI / PP / หมอดี (OPD) / หมอดี (สปสช))

บอทตอบคำถาม 4 โครงการด้วย Quick Reply + Flex Message
- CI: วิธีการทำงาน / รายการยา / Incentive / ติดต่อเจ้าหน้าที่
- PP: วิธีการทำงาน / รายการยา / ติดต่อเจ้าหน้าที่
- หมอดี (OPD): วิธีการทำงาน / รายการยา / ติดต่อเจ้าหน้าที่
- หมอดี (สปสช): วิธีการทำงาน / รายการยา / ติดต่อเจ้าหน้าที่

## Environment Variables ที่ต้องตั้ง
- `CHANNEL_SECRET` — ค่าจาก LINE Developers (Basic settings → Channel Secret)
- `CHANNEL_ACCESS_TOKEN` — ค่าจาก LINE Developers (Messaging API → Issue Channel access token)

### URLs ต่อหัวข้อ
- CI: `CI_WORKFLOW_URL`, `CI_DRUGS_URL`, `CI_INCENTIVE_URL`, `CI_CONTACT_URL`
- PP: `PP_WORKFLOW_URL`, `PP_DRUGS_URL`, `PP_CONTACT_URL`
- OPD: `OPD_WORKFLOW_URL`, `OPD_DRUGS_URL`, `OPD_CONTACT_URL`
- สปสช: `NHSO_WORKFLOW_URL`, `NHSO_DRUGS_URL`, `NHSO_CONTACT_URL`

## ทดสอบบนเครื่อง (Local) + ngrok
```bash
npm install
export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN

# ตัวอย่างตั้ง URL
export CI_WORKFLOW_URL=https://example.com/ci/workflow
export CI_DRUGS_URL=https://example.com/ci/drugs
export CI_INCENTIVE_URL=https://example.com/ci/incentive
export CI_CONTACT_URL=https://example.com/ci/contact
# ทำแบบเดียวกันสำหรับ PP/OPD/NHSO

npm start
ngrok http 3000
