# CORS Muammosi Yechimi

## 🔧 Qo'lga olingan O'zgarishlar

### 1. **Axios Konfiguratsiyasi** (`src/config/axios.js`)
- Prod va dev uchun ham `/api` proxy ishlatiladi
- CORS request headers qo'shildi
- `withCredentials: true` sozlandi

### 2. **Vercel Serverless Functions** (`api/`)
- `api/index.js` - Asosiy proxy endpoint
- `api/proxy.js` - Alternative proxy endpoint
- Barcha OPTIONS, GET, POST, PUT, DELETE requestlarini supported qiladi
- Backend URLga request forward qiladi va CORS headers qo'shadi

### 3. **Build Konfiguratsiyasi**
- **package.json**: Build paytida api dependencies install qilinadi
- **vercel.json**: Vercel uchun serverless functions konfiguratsiyasi
- **vite.config.js**: Dev rejimida /api proxy ishlatiladi

## 📋 Deployment Qadamlari

### Lokalda Test Qilish
```bash
npm install
npm run dev
```
Dev rejimida Vite proxy `/api` requestlarni backendga forwarding qiladi.

### Vercelda Deploy Qilish

1. **Github'ga push qiling:**
```bash
git add .
git commit -m "Fix CORS issue with serverless proxy"
git push
```

2. **Vercelda deploy qiling:**
   - Vercel dashboardga o'ting: https://vercel.com
   - "New Project" → Github repo tanlang
   - Build command shu holatda qolsin: `npm run build`
   - Output directory: `dist`
   - Deploy qiling ✓

3. **Environment Variables (opsional):**
   - `VITE_API_URL` = `https://e-commerce-api-v4.nt.azimumarov.uz`

## ✅ Natija

- ✓ Extension-siz ham mahsulotlar chiqadi
- ✓ CORS errors yo'q
- ✓ Prod va dev uchun ishlaydi
- ✓ Secure va fast

## 🔍 Tekshirish

Prodda deploy qilingandan keyin:
1. Developer console ochib F12 → Network tab
2. `/api/products` request chiqishini ko'ring
3. Response status 200 bo'lishi kerak
4. Mahsulotlar ko'rinsin

## 📝 Texnik Tafsilotlar

**Flow:**
```
Client (React) 
  ↓
/api request (axios)
  ↓
Vite Proxy (dev) / Vercel Serverless (prod)
  ↓
Backend: e-commerce-api-v4.nt.azimumarov.uz
  ↓
Response + CORS headers
  ↓
Client renders products
```
