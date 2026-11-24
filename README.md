# activity7-backend (ICT251 Activity 7)

Express + PostgreSQL REST API. Files: `server.js`, `db.js`, `routes/records.js`, `validate.js`, `schema.sql`, `seed.sql`.
Tables and the 10 seed records are created automatically on first start (seed only runs when the table is empty).

## 1. Fix the problems seen in your video
1. **`npm error network / ECONNRESET`** – npm cannot reach the registry. Try, in order:
   - Switch network (phone hotspot often works when campus Wi-Fi blocks npm).
   - `npm config delete proxy` and `npm config delete https-proxy`, then `npm config set registry https://registry.npmjs.org/`
   - `npm install --fetch-retries=5 --fetch-retry-mintimeout=20000`
   - PowerShell: use `npm.cmd` if `npm.ps1` is blocked.
2. **`routes/records.js` contains the code that belongs in `db.js`** (the `new Pool(...)` block). Replace the whole file with the one in this folder.

## 2. Run locally
```
npm install
copy .env.example .env      (Mac/Linux: cp .env.example .env)   then edit DATABASE_URL
npm start
```
Open http://localhost:3000 (API guide) and http://localhost:3000/health.
Edit `PROJECT_NAME`, `STUDENT_NUMBER` and `SYSTEM_DESCRIPTION` at the top of `server.js`; change categories/seed text to match your Activity 6 system.

## 3. Database (hosted, persistent)
The brief says "SQLite", but its own code (`pg`, `$1`, `RETURNING`) and Render's temporary disk both point to PostgreSQL, so this project uses Postgres.
Free options: **Neon** (neon.tech) or **Supabase** – create a project, copy the connection string into `DATABASE_URL`.
(Render's free Postgres expires after 30 days – check current limits.) If your lecturer insists on SQLite, ask for approval first: SQLite files are wiped on Render free restarts.

## 4. Deploy on Render
1. Push this folder to GitHub (`.env` and `node_modules` are git-ignored; commit `package-lock.json`).
2. Render → New → Web Service → pick the repo. Build: `npm install`. Start: `npm start`. Instance: Free.
3. Environment variables: `DATABASE_URL`, `NODE_ENV=production`, `CLIENT_ORIGINS` (your Activity 8 frontend URL(s), comma-separated).
4. Open the `https://....onrender.com` URL, check `/health`, then run the tests below. Submit that base URL.

## 5. Postman test list
| Test | Expect |
|---|---|
| GET /health | 200 |
| GET /api/records | 200 array |
| POST /api/records (valid body) | 201 + id |
| GET /api/records/{id} | 200 |
| PUT /api/records/{id} (all 4 fields) | 200, same id |
| DELETE /api/records/{id} | 200 `{"message":"Record deleted."}`, then GET → 404 |
| POST with missing title / status "Done" | 400 |
| GET /api/records/abc, or malformed JSON | 400 |
| GET/PUT/DELETE /api/records/99999 | 404 |
| Restart server, GET the record again | still there |
