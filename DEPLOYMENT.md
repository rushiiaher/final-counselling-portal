# Deploying to Vercel

The app is a Next.js 16 + Prisma (PostgreSQL) project. Vercel builds it with
`npm install` and `npm run build` (which runs `prisma generate` first) — no extra
build settings are needed.

## 1. Create a production database

Vercel cannot reach a database running on your own computer, so you need a hosted
PostgreSQL database. Easiest: in Vercel open **Storage → Create Database → Neon**
(free tier), or use [Neon](https://neon.tech) / [Supabase](https://supabase.com)
directly. Pick a region close to India (e.g. Mumbai / `ap-south-1`) if offered.

You will get two connection strings:

| Variable | Which URL |
|---|---|
| `DATABASE_URL` | the **pooled** connection string (Neon: host contains `-pooler`; Supabase: port `6543`, add `?pgbouncer=true`) |
| `DIRECT_URL` | the **direct** (non-pooled) connection string |

## 2. Create the tables and accounts (one time, from your computer)

In the project folder, with the production URLs:

```bash
# create all tables in the production database
DATABASE_URL="<pooled url>" DIRECT_URL="<direct url>" npx prisma db push

# create the admin + the 9 counsellor accounts (strong passwords, no test student)
DATABASE_URL="<pooled url>" DIRECT_URL="<direct url>" \
ADMIN_EMAIL="your-admin@email" ADMIN_PASSWORD="<strong password>" \
COUNSELLOR_PASSWORD="<strong password>" \
node prisma/setup-local-accounts.js --production
```

On Windows PowerShell, set the variables first, e.g. `$env:DATABASE_URL="..."`,
then run the commands without the prefixes.

Counsellor logins are `firstname.lastname@dyedc-anantnag.gov.in` (see
`prisma/setup-local-accounts.js`) — replace these with real staff emails before
running, and ask each counsellor to change their password.

## 3. Create the Vercel project

1. Vercel → **Add New → Project** → import `samnikam/final-counselling-portal`.
2. Framework preset: **Next.js** (auto-detected). Leave build & install commands as default.
3. Add these **Environment Variables** (Production):

| Name | Value |
|---|---|
| `DATABASE_URL` | pooled URL from step 1 |
| `DIRECT_URL` | direct URL from step 1 |
| `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` |
| `NEXTAUTH_URL` | your site URL, e.g. `https://final-counselling-portal.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | same as `NEXTAUTH_URL` |
| `ENCRYPTION_KEY` | output of `openssl rand -hex 32` (exactly 64 hex characters) |
| `CRON_SECRET` | output of `openssl rand -hex 16` |

No `openssl`? Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
(use `16` for `CRON_SECRET`).

**Keep `ENCRYPTION_KEY` safe and never change it** — counselling notes and messages
are encrypted with it.

4. Click **Deploy**.

## 4. After the first deploy

- If you used the auto-generated `*.vercel.app` URL, make sure `NEXTAUTH_URL` and
  `NEXT_PUBLIC_APP_URL` match it exactly; when you add a custom domain, update both
  and redeploy.
- Check `https://<your-site>/api/health` responds, then sign in as the admin.
- Optional: rate limiting is in-memory per server instance; for stricter limits add
  an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.

## Changing the database schema later

Edit `prisma/schema.prisma`, then run `npx prisma db push` against the production
database (step 2) before or right after deploying.
