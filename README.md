# 🍽️ Restaurant App Admin Panel

A modern admin dashboard to manage restaurants, menus, and menu items — built with **Next.js (App Router)**, **TypeScript**, **Firebase Firestore**, **Tailwind CSS**, and **ShadCN UI**.

![screenshot](public/screenshot.png) <!-- Optional: Add your screenshot path here -->

---

## ✨ Features

- 🔐 **Admin Authentication** – Secure login with Firebase Auth
- 🏪 **Add Restaurants** – Easily add restaurants with name, location, and image
- 📋 **Menu Management** – (Coming soon) Add menus and menu items per restaurant
- 🎨 **Modern UI** – Clean interface using Tailwind CSS + ShadCN components
- ⚡ **Fast and Scalable** – Built on Next.js with the App Router

---

## 🧑‍💻 Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) (Auth + Firestore)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/restaurant-admin-panel.git
cd restaurant-admin-panel
```

### 2. Install Dependancies
```
npm install
```
### 3. Add the .env
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run the Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
