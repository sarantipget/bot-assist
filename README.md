
# LINE OA Webhook Bot (Vercel)
บอตตอบคำถามโครงการพิเศษ (CI, PP, MORDEE-OPD, MORDEE-CI) ด้วย Flex Message ปุ่มใหญ่

## วิธีใช้งานเร็ว
1) สร้างโปรเจกต์ Vercel, เชื่อมกับ repo นี้  
2) ตั้ง ENV:
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`

3) Deploy แล้วตั้ง LINE Webhook → `https://<your-project>.vercel.app/webhook`

## โครงสร้างไฟล์
.
├─ api/index.js
├─ package.json
├─ vercel.json
└─ README.md
``
