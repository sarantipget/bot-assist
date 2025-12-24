# LINE OA Webhook Bot (Vercel)
บอตตอบคำถามโครงการ (CI, PP, MORDEE-OPD, MORDEE-CI) ด้วย Flex ปุ่มใหญ่  
รองรับให้ลูกค้ากดปุ่มแล้ว **ส่งคีย์เวิร์ดเอง** เพื่อชน Auto Reply ของ OA

## Endpoint
- แนะนำ: `https://<project>.vercel.app/api/webhook`
- ทางเลือก (ต้องมี vercel.json): `https://<project>.vercel.app/webhook`

## Env (Vercel → Project → Settings → Environment Variables)
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`

## Deploy
```bash
npm install
npm run deploy
``
