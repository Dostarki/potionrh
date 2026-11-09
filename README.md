# PotionRH

Tek Vercel projesinde oyun, oyuncu API’si ve admin paneli.

- `/` oyun (`frontend/public/game.html`)
- `/admin` görev linkleri ve oyuncu tablosu
- `/api/*` FastAPI + MongoDB Atlas

Üretimde site ve API aynı domaindedir. Tarayıcı `/api/...` yollarına aynı origin üzerinden gider.

## Vercel

1. [MongoDB Atlas](https://www.mongodb.com/atlas) kümesi aç. Network Access içinde `0.0.0.0/0` ekle (Vercel IP’leri değişir). Connection string’i kopyala.
2. Projeyi GitHub’a koyup Vercel’de **Import** et. Framework’ü FastAPI olarak bırak. Root Directory repo kökü olsun.
3. Environment Variables:

| Ad | Değer |
| --- | --- |
| `MONGO_URL` | Atlas connection string |
| `DB_NAME` | `potionrh` |
| `JWT_SECRET` | uzun rastgele metin |
| `ADMIN_PASSWORD` | admin şifresi |

`REACT_APP_BACKEND_URL` boş kalsın. Doluysa build sırasında o adres gömülür.

4. Deploy. Oyun `https://<proje>.vercel.app`, admin `https://<proje>.vercel.app/admin`.

CLI ile: repo kökünde `npx vercel`.

## Yerel

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn backend.server:app --reload --port 8000
```

İkinci terminal:

```bash
cd frontend
yarn install
yarn start
```

API `http://localhost:8000`, arayüz `http://localhost:3000`. `yarn start` `.env.development` içindeki API adresini kullanır.

Komutları repo kökünden çalıştır. FastAPI, `frontend/build` klasörünü bu kökten okur.
