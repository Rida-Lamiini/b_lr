# Brain OS (Next.js)

A Next.js app with an App Router + NextAuth + Prisma + SQLite (for local development).

---

## ✅ Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and set secrets:

```bash
cp .env.example .env
# then edit .env and set a strong NEXTAUTH_SECRET
```

3. Generate/update the database schema and apply migrations:

```bash
npx prisma migrate dev
```

4. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🧠 Authentication & Setup flow

- This app uses **NextAuth (credentials provider)** with **bcrypt** for password hashing.
- The `/setup` page is a one-time onboarding route that creates the first user.
- The `/login` page is used for signing in.

---

## 🔒 Security notes

- Don’t commit `.env` to source control. Use `.env.example` as a template.
- The local SQLite database file (`dev.db`) is ignored by default.

---

## 🧩 Project structure

- `app/` – Next.js App Router pages and API routes
- `src/` – shared UI components, hooks, and utilities
- `prisma/` – database schema + migrations

---

## 🚀 Deploying

This project can be deployed on Vercel or any platform that supports Next.js.

Make sure to provide the following environment variables in production:

- `DATABASE_URL` (use a managed database)
- `NEXTAUTH_SECRET` (use a securely generated value)
- `NEXTAUTH_URL` (your production URL)
