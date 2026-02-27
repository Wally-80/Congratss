"use client";

import { Calendar, ChevronLeft, ChevronRight, Home, Plus, Settings } from "lucide-react";

type StyleVariant = 1 | 2 | 3 | 4 | 5;

type DayCell = {
  date: Date;
  day: number;
  inMonth: boolean;
};

type EventTone = "cyan" | "pink" | "amber" | "blue";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAME = "March 2026";
const TODAY_DAY = 12;

const eventsByDay: Record<number, { label: string; tone: EventTone }> = {
  2: { label: "Ana Birthday", tone: "pink" },
  8: { label: "Party", tone: "cyan" },
  12: { label: "Team Day", tone: "blue" },
  18: { label: "Retirement", tone: "amber" },
  27: { label: "Graduation", tone: "cyan" },
};

const toneDotClass: Record<EventTone, string> = {
  cyan: "bg-cyan-400",
  pink: "bg-pink-400",
  amber: "bg-amber-400",
  blue: "bg-blue-400",
};

function buildMonthGrid(year: number, monthIndex: number): DayCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startDay = firstOfMonth.getDay();
  const firstGridDay = new Date(year, monthIndex, 1 - startDay);
  const cells: DayCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(firstGridDay);
    date.setDate(firstGridDay.getDate() + i);
    cells.push({
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === monthIndex,
    });
  }

  return cells;
}

const monthCells = buildMonthGrid(2026, 2);

function AppNav({ style }: { style: StyleVariant }) {
  const rootClass =
    style === 1
      ? "bg-black/30 border-white/10 backdrop-blur-2xl"
      : style === 2
        ? "bg-slate-900 border-slate-800"
        : style === 3
          ? "bg-white/85 border-slate-200 backdrop-blur-xl"
          : style === 4
            ? "bg-zinc-950 border-zinc-800"
            : "bg-cyan-50 border-cyan-100";

  const activeClass =
    style === 3 || style === 5
      ? "text-cyan-700"
      : "text-cyan-400";

  const idleClass =
    style === 3 || style === 5
      ? "text-slate-500"
      : "text-slate-400";

  return (
    <nav className={`border-t pwa-nav-spacer px-4 flex items-start justify-around ${rootClass}`}>
      <button className={`flex flex-col items-center gap-1 ${idleClass}`}>
        <Home className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Home</span>
      </button>
      <button className={`flex flex-col items-center gap-1 ${activeClass} scale-110`}>
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Calendar</span>
      </button>
      <button className={`flex flex-col items-center gap-1 ${idleClass}`}>
        <Settings className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Settings</span>
      </button>
    </nav>
  );
}

function MonthHeader({ variant }: { variant: StyleVariant }) {
  const textClass =
    variant === 3 || variant === 5 ? "text-slate-800" : "text-slate-100";
  const subTextClass =
    variant === 3 || variant === 5 ? "text-slate-500" : "text-slate-400";
  const buttonClass =
    variant === 3 || variant === 5
      ? "border-slate-300 text-slate-600 hover:bg-slate-100"
      : "border-white/20 text-slate-300 hover:bg-white/10";

  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${subTextClass}`}>Calendar View</p>
          <h3 className={`text-lg font-bold ${textClass}`}>{MONTH_NAME}</h3>
        </div>
        <div className="flex gap-2">
          <button className={`w-8 h-8 rounded-lg border grid place-items-center transition-colors ${buttonClass}`}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className={`w-8 h-8 rounded-lg border grid place-items-center transition-colors ${buttonClass}`}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DayCellView({
  variant,
  day,
  inMonth,
}: {
  variant: StyleVariant;
  day: number;
  inMonth: boolean;
}) {
  const isToday = inMonth && day === TODAY_DAY;
  const event = inMonth ? eventsByDay[day] : undefined;

  if (variant === 1) {
    return (
      <div className={`rounded-xl border p-2 min-h-14 ${inMonth ? "border-white/10 bg-white/[0.03]" : "border-white/5 bg-white/[0.01] opacity-40"}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? "text-black bg-cyan-400 rounded-md px-1.5 py-0.5 font-bold" : "text-slate-200"}`}>{day}</span>
          {event && <span className={`w-1.5 h-1.5 rounded-full ${toneDotClass[event.tone]}`} />}
        </div>
      </div>
    );
  }

  if (variant === 2) {
    return (
      <div className={`rounded-lg border p-2 min-h-14 ${inMonth ? "border-slate-700 bg-slate-800" : "border-slate-800 bg-slate-900/60 opacity-40"}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? "text-white font-bold" : "text-slate-300"}`}>{day}</span>
          {event && <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
        </div>
      </div>
    );
  }

  if (variant === 3) {
    return (
      <div className={`rounded-xl border p-2 min-h-14 ${inMonth ? "border-slate-200 bg-white shadow-sm" : "border-slate-100 bg-slate-50 opacity-50"}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? "text-cyan-700 font-bold" : "text-slate-700"}`}>{day}</span>
          {event && <span className={`w-1.5 h-1.5 rounded-full ${toneDotClass[event.tone]}`} />}
        </div>
      </div>
    );
  }

  if (variant === 4) {
    return (
      <div className={`rounded-none border p-2 min-h-14 ${inMonth ? "border-zinc-800 bg-zinc-950" : "border-zinc-900 bg-black opacity-50"}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? "text-cyan-300 font-bold" : "text-zinc-300"}`}>{day}</span>
          {event && <span className={`w-1.5 h-1.5 rounded-full ${toneDotClass[event.tone]}`} />}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-2 min-h-14 ${inMonth ? "border-cyan-100 bg-white" : "border-cyan-50 bg-cyan-50/40 opacity-60"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${isToday ? "text-cyan-700 font-bold" : "text-slate-700"}`}>{day}</span>
        {event && <span className={`w-1.5 h-1.5 rounded-full ${toneDotClass[event.tone]}`} />}
      </div>
    </div>
  );
}

function MonthGrid({ variant }: { variant: StyleVariant }) {
  const labelClass =
    variant === 3 || variant === 5
      ? "text-slate-500"
      : variant === 4
        ? "text-zinc-500"
        : "text-slate-400";

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEK_DAYS.map((label) => (
          <div key={label} className={`text-[10px] font-bold uppercase tracking-widest text-center ${labelClass}`}>
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {monthCells.map((cell) => (
          <DayCellView key={`${cell.date.toISOString()}-${cell.day}`} variant={variant} day={cell.day} inMonth={cell.inMonth} />
        ))}
      </div>
    </div>
  );
}

function EventsRow({ variant }: { variant: StyleVariant }) {
  const textClass =
    variant === 3 || variant === 5
      ? "text-slate-700"
      : "text-slate-200";
  const wrapClass =
    variant === 3 || variant === 5
      ? "border-slate-200"
      : variant === 4
        ? "border-zinc-800"
        : "border-white/10";

  return (
    <div className={`mx-4 mb-4 rounded-2xl border p-3 ${wrapClass}`}>
      <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${textClass}`}>Upcoming</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(eventsByDay).slice(0, 4).map(([day, event]) => (
          <span
            key={`${day}-${event.label}`}
            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] border ${wrapClass} ${textClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${toneDotClass[event.tone]}`} />
            {day} {event.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StylePreview({
  title,
  subtitle,
  variant,
  frameClass,
  headerClass,
}: {
  title: string;
  subtitle: string;
  variant: StyleVariant;
  frameClass: string;
  headerClass: string;
}) {
  const fabClass =
    variant === 3 || variant === 5
      ? "bg-cyan-600 text-white"
      : "bg-neon-cyan text-black";

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-[var(--app-text)]">{title}</h2>
        <p className="text-sm text-[var(--app-text-muted)]">{subtitle}</p>
      </div>

      <div className={`w-full sm:max-w-md h-[760px] rounded-[34px] border overflow-hidden flex flex-col relative ${frameClass}`}>
        <header className={`pt-[max(0.8rem,env(safe-area-inset-top))] border-b ${headerClass}`}>
          <MonthHeader variant={variant} />
        </header>

        <div className={`flex-1 overflow-y-auto ${headerClass}`}>
          <MonthGrid variant={variant} />
          <EventsRow variant={variant} />
        </div>

        <button className={`absolute right-5 bottom-24 w-14 h-14 rounded-2xl shadow-lg grid place-items-center ${fabClass}`}>
          <Plus className="w-7 h-7" />
        </button>

        <AppNav style={variant} />
      </div>
    </section>
  );
}

export default function CalendarStylesPage() {
  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-6 py-8 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Design Lab</p>
          <h1 className="text-3xl font-bold text-[var(--app-text)]">5 Modern Calendar Views</h1>
          <p className="text-sm text-[var(--app-text-dim)]">All samples use a true month grid and PWA-safe header/footer spacing.</p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <StylePreview
            title="Style 1: Glass Neon Month"
            subtitle="Premium dark glass with subtle event dots."
            variant={1}
            frameClass="glass-pane sm:rounded-[34px] border-white/10"
            headerClass="bg-transparent text-[var(--app-text)]"
          />

          <StylePreview
            title="Style 2: Midnight Minimal Month"
            subtitle="Flat dark blocks, sharp and calm."
            variant={2}
            frameClass="bg-slate-900 border-slate-700"
            headerClass="bg-slate-900 border-slate-700"
          />

          <StylePreview
            title="Style 3: Soft Daylight Month"
            subtitle="Light cards with clear hierarchy and color accents."
            variant={3}
            frameClass="bg-slate-50 border-slate-200"
            headerClass="bg-slate-50 border-slate-200"
          />

          <StylePreview
            title="Style 4: Gridline Editorial Month"
            subtitle="Bold line-based layout for heavy planners."
            variant={4}
            frameClass="bg-zinc-950 border-zinc-800"
            headerClass="bg-zinc-950 border-zinc-800"
          />

          <StylePreview
            title="Style 5: Airy Planner Month"
            subtitle="Bright compact planner for dense schedules."
            variant={5}
            frameClass="bg-gradient-to-b from-sky-50 to-cyan-50 border-cyan-100"
            headerClass="bg-transparent border-cyan-100"
          />
        </div>
      </div>
    </main>
  );
}
