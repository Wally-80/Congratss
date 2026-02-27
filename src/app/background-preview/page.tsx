"use client";

import { Calendar, Home, Images, Settings, Shield, Sparkles } from "lucide-react";

function Frame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-lg font-bold text-[var(--app-text)]">{title}</h2>
        <p className="text-sm text-[var(--app-text-muted)]">{subtitle}</p>
      </div>

      <div className="relative w-full sm:max-w-md h-[700px] rounded-[34px] border border-slate-700 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
        <div className="relative z-10 h-full flex flex-col">{children}</div>
      </div>
    </section>
  );
}

function TopBar({ label }: { label: string }) {
  return (
    <header className="px-5 py-4 border-b border-slate-700/80 bg-[#151820]/80 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Background Preview</p>
      <h3 className="text-base font-semibold text-slate-100">{label}</h3>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="mt-auto border-t border-slate-700/80 bg-[#151820]/90 backdrop-blur-2xl pwa-nav-spacer px-4 flex items-start justify-around">
      <button className="flex flex-col items-center gap-1 text-slate-400">
        <Home className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-cyan-400 scale-110">
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Calendar</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-slate-400">
        <Settings className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Settings</span>
      </button>
    </nav>
  );
}

function HomeSample() {
  return (
    <>
      <TopBar label="Home" />
      <div className="p-4 space-y-3">
        <div className="h-11 rounded-xl border border-slate-700 bg-[#1b212d] text-slate-400 px-4 flex items-center text-sm">
          Search celebrations...
        </div>
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4">
          <p className="text-xs text-slate-400 mb-1">Mar 12</p>
          <p className="text-slate-100 font-semibold">Team Anniversary</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4">
          <p className="text-xs text-slate-400 mb-1">Mar 18</p>
          <p className="text-slate-100 font-semibold">Retirement Party</p>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

function CalendarSample() {
  return (
    <>
      <TopBar label="Calendar" />
      <div className="p-4 space-y-3">
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-3">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className={`h-9 rounded-md border text-[10px] grid place-items-center ${
                  index % 9 === 0 ? "border-cyan-500 text-cyan-300 bg-[#1e2430]" : "border-slate-700 text-slate-300 bg-[#1e2430]"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

function SettingsSample() {
  return (
    <>
      <TopBar label="Settings" />
      <div className="p-4 space-y-3">
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-600/40" />
          <div>
            <p className="text-slate-100 text-sm font-semibold">User Name</p>
            <p className="text-slate-400 text-xs">user@email.com</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4 text-slate-200 text-sm">Edit Profile</div>
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4 text-slate-200 text-sm">Language</div>
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-4 text-slate-200 text-sm">Theme</div>
      </div>
      <BottomNav />
    </>
  );
}

function AdminSample() {
  return (
    <>
      <TopBar label="Admin" />
      <div className="p-4 space-y-3">
        <div className="rounded-2xl border border-slate-700 bg-[#1b212d] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 text-xs">
            <Shield className="w-4 h-4 text-cyan-300" />
            Library Management
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black text-[10px] font-bold">Add New</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-xl border border-slate-700 bg-[#1b212d]" />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

function PickSendSample() {
  return (
    <>
      <TopBar label="Pick & Send" />
      <div className="p-4">
        <div className="rounded-3xl border border-slate-700 bg-[#1b212d]/95 p-4 space-y-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Pick & Send
          </div>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-24 h-24 rounded-xl border border-slate-700 bg-[#151820]" />
            ))}
          </div>
          <div className="h-24 rounded-xl border border-slate-700 bg-[#151820] p-3 text-slate-400 text-xs">Personal message...</div>
          <button className="w-full py-3 rounded-xl bg-cyan-400 text-black text-sm font-bold">Share With Device</button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function BackgroundPreviewPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--app-bg)] px-6 py-8 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Theme Preview</p>
          <h1 className="text-3xl font-bold text-[var(--app-text)]">Calendar Background Across All Pages</h1>
          <p className="text-sm text-[var(--app-text-dim)]">
            Quick visual mockups using the same calendar-style background and layered surfaces.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <Frame title="Home" subtitle="Search + celebration cards">
            <HomeSample />
          </Frame>

          <Frame title="Calendar" subtitle="Month grid on same dark surface">
            <CalendarSample />
          </Frame>

          <Frame title="Settings" subtitle="Form cards with same depth">
            <SettingsSample />
          </Frame>

          <Frame title="Admin" subtitle="Dashboard controls + media grid">
            <AdminSample />
          </Frame>

          <Frame title="Pick & Send" subtitle="Modal content on shared background">
            <PickSendSample />
          </Frame>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-[#151820]/70 p-4 flex items-center gap-2 text-sm text-slate-300">
          <Images className="w-4 h-4 text-cyan-300" />
          Route: <span className="font-semibold text-cyan-300">/background-preview</span>
        </div>
      </div>
    </main>
  );
}
