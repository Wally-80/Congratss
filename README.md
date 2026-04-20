<div align="center">
  <img src="public/logo.png" alt="Congratss Logo" width="200" />
  <h1>Congratss - Celebration Management Platform</h1>
  <p>A modern, high-performance Progressive Web Application (PWA) for managing and scheduling celebrations.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Ready-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
</div>

## 📌 Overview

Congratss is a Next.js web application that helps users remember important dates, manage countdowns, and send greetings and scheduled messages from a single dashboard. Built with modern web technologies, it allows users to elegantly schedule greetings, maintain a timeline of special events natively on mobile and web, and share celebrations directly.

## 🏁 Spec-Driven Development (SDD)

This project strictly follows the **Spec-Driven Development (SDD)** methodology using **GitHub Spec Kit**. All new features must be planned and specified before implementation.

Check the `.speckit/` directory for our templates:
- `.speckit/constitution.md`: Core project principles.
- `.speckit/specification.md`: Feature requirements template.
- `.speckit/plan.md`: Technical implementation plan template.
- `.speckit/tasks.md`: Task breakdown for implementation.

## ✨ Key Features

- **PWA Ready**: Installable on iOS and Android devices directly from the browser.
- **Native Wrappers**: Integrated with Capacitor for seamless compilation to native App Store and Google Play binaries.
- **Real-Time Data**: Persistent synchronized data provided via Firebase Firestore and Auth.
- **Dynamic Scheduling**: Flexible timelines for upcoming events, greetings, and special dates.
- **Fast Notifications**: Real-time push notifications via FCM and reliable offline local notifications.
- **Fully Responsive**: Crafted with modern dark-mode aesthetic that looks stunning across devices.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Vanilla CSS with modern aesthetics.
- **Backend/Auth**: Firebase (Auth, Firestore, Storage)
- **Mobile Runtime**: Capacitor (iOS & Android Wrappers)
- **Icons**: Lucide React

## 🚀 Quick Start

### 1. Prerequisite Checks
Ensure you have `Node.js >= 20.0.0` and `npm` installed.

### 2. Clone and Install
```bash
git clone https://github.com/Wally-80/Gratzz.git
cd gratzz
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to create your local environment values:
```bash
cp .env.example .env.local
```
*(Contact repository administrator for Firebase Config strings)*

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
- [RUNBOOK.md](./RUNBOOK.md) - Deployment routines and operational fixes.

## 📄 License
*Proprietary and Confidential. All rights reserved.*
