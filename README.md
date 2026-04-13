<div align="center">
  <img src="public/logo.png" alt="Gratzz Logo" width="200" />
  <h1>Gratzz - Celebration Management Platform</h1>
  <p>A modern, high-performance Progressive Web Application (PWA) for managing and scheduling celebrations.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Ready-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
</div>

## 📌 Overview

Gratzz is a versatile, multi-platform celebration and milestone management tool. Built with modern web technologies, it allows users to elegantly schedule greetings, maintain a timeline of special events natively on mobile and web, and share celebrations directly. 

## ✨ Key Features

- **PWA Ready**: Installable on iOS and Android devices directly from the browser.
- **Native Wrappers**: Integrated with Capacitor for seamless compilation to native App Store and Google Play binaries.
- **Real-Time Data**: Persistent synchronized data provided via Firebase Firestore and Auth.
- **Dynamic Scheduling**: Flexible timelines for upcoming events, greetings, and special dates.
- **Fully Responsive**: Crafted with Tailwind CSS to look stunning across desktop, tablet, and mobile breakpoints.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Tailwind CSS
- **Backend/Auth**: Firebase (Auth, Firestore, Storage)
- **Mobile Runtime**: Capacitor (iOS & Android Wrappers)
- **Icons**: Lucide React

## 🚀 Quick Start

### 1. Prerequisite Checks
Ensure you have `Node.js >= 20.0.0` and `npm` installed. For mobile testing, Android Studio or Xcode is required.

### 2. Clone and Install
```bash
git clone https://github.com/your-org/gratzz.git
cd gratzz
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to create your local environment values:
```bash
cp .env.example .env.local
```
*(Contact repository administrator to securely access the necessary Firebase Config strings)*

### 4. Run Development Server
```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application.

## 📂 Documentation Structure
To understand our architectural, strategic, and operational workflows, please refer to the following:
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Coding standards, PR rules, and Git flows.
- [DECISIONS.md](./DECISIONS.md) - Architectural Decision Records (ADRs).
- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Strategic roadmap and high-level milestones.
- [CHECKLIST.md](./CHECKLIST.md) - Immediate execution goals and QA checklists.
- [RUNBOOK.md](./RUNBOOK.md) - Deployment routines, rollbacks, and operational fixes.

## 📄 License
*Proprietary and Confidential. All rights reserved.*
