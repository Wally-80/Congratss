"use client";

import React, { useState, useEffect } from "react";
import { Plus, Home as HomeIcon, Calendar as CalendarIcon, Settings, Search, LogOut, Send, ChevronLeft, ChevronRight, Pencil, Trash2, Info, Shield } from "lucide-react";
import CelebrationCard from "@/components/CelebrationCard";
import AddCelebrationModal from "@/components/AddCelebrationModal";
import EditProfileModal from "@/components/EditProfileModal";
import SendGreetingModal from "@/components/SendGreetingModal";
import AdminDashboard from "@/components/AdminDashboard";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { type Celebration, useCelebrations } from "@/hooks/useCelebrations";
import { translations } from "@/lib/translations";
import { playCelebrationChime } from "@/lib/sound";
import AuthPage from "./auth/page";
import { useTheme } from "@/context/ThemeContext";

type CelebrationFormData = {
    id?: string;
    title: string;
    rawDate: string;
    type: Celebration["type"];
    customTypeLabel?: string;
};

type EditableCelebration = {
    id: string;
    title: string;
    rawDate: string;
    type: Celebration["type"];
    customTypeLabel?: string;
};

type SendGreetingTarget = {
    title: string;
    type: Celebration["type"];
    customTypeLabel?: string;
};

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const { user, isAdmin, language, notificationsEnabled, setNotificationsEnabled, setLanguage, loading: authLoading, logout, updateUserProfile } = useAuth();
    const t = translations[language];
    const isDarkMode = theme === "dark";

    const { celebrations, loading: dataLoading, error: dataError, addCelebration, updateCelebration, deleteCelebration } = useCelebrations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendGreetingModalOpen, setIsSendGreetingModalOpen] = useState(false);
    const [editingCelebration, setEditingCelebration] = useState<EditableCelebration | null>(null);
    const [sendingCelebration, setSendingCelebration] = useState<SendGreetingTarget | null>(null);
    const [addModalDefaultDate, setAddModalDefaultDate] = useState("");
    const [activeTab, setActiveTab] = useState("home");
    const [searchQuery, setSearchQuery] = useState("");
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [showFab, setShowFab] = useState(true);
    const [calendarMonthStart, setCalendarMonthStart] = useState(() => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    });
    const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(new Date().getUTCDate());

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

    const handleDeleteClick = async (id: string) => {
        setItemToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await deleteCelebration(itemToDelete);
            setItemToDelete(null);
        }
    };



    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowFab(true);
        }, 600);
        return () => clearTimeout(timeout);
    }, [lastScrollTop]);

    useEffect(() => {
        if (!user || typeof window === "undefined") return;

        const resetViewport = () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        resetViewport();
        const raf = window.requestAnimationFrame(resetViewport);
        const timer = window.setTimeout(resetViewport, 80);

        return () => {
            window.cancelAnimationFrame(raf);
            window.clearTimeout(timer);
        };
    }, [user]);

    useEffect(() => {
        if (typeof window === "undefined" || !("Notification" in window)) return;

        const syncPermission = () => setNotificationPermission(Notification.permission);
        syncPermission();

        window.addEventListener("focus", syncPermission);
        document.addEventListener("visibilitychange", syncPermission);

        return () => {
            window.removeEventListener("focus", syncPermission);
            document.removeEventListener("visibilitychange", syncPermission);
        };
    }, []);

    useEffect(() => {
        if (!notificationsEnabled) return;
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission !== "granted") return;
        const activeTranslations = translations[language];

        const todayKey = new Date().toISOString().slice(0, 10);

        celebrations.forEach((item) => {
            let reminderType: "today" | "tomorrow" | "week" | null = null;
            if (item.daysLeft === 0) reminderType = "today";
            if (item.daysLeft === 1) reminderType = "tomorrow";
            if (item.daysLeft === 7) reminderType = "week";
            if (!reminderType) return;

            const dedupeKey = `gratzz_notify_${item.id}_${reminderType}_${todayKey}`;
            if (localStorage.getItem(dedupeKey)) return;

            const reminderTemplate = reminderType === "today"
                ? activeTranslations.notification_body_today
                : reminderType === "tomorrow"
                    ? activeTranslations.notification_body_tomorrow
                    : activeTranslations.notification_body_week;
            const reminderBody = reminderTemplate.replace("{title}", item.title);

            try {
                new Notification(activeTranslations.notification_title, {
                    body: reminderBody,
                    tag: dedupeKey,
                });
                localStorage.setItem(dedupeKey, "1");
            } catch (error) {
                console.error("Notification error:", error);
            }
        });
    }, [celebrations, language, notificationsEnabled]);

    const filteredCelebrations = celebrations
        .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.daysLeft - b.daysLeft);

    const handleUpdateProfile = async (displayName: string, photoURL: string) => {
        await updateUserProfile(displayName, photoURL);
    };

    const handleToggleNotifications = async () => {
        if (notificationsEnabled) {
            await setNotificationsEnabled(false);
            return;
        }

        if (typeof window === "undefined" || !("Notification" in window)) {
            alert(t.notifications_not_supported);
            await setNotificationsEnabled(false);
            return;
        }

        if (Notification.permission === "denied") {
            alert(t.notifications_blocked);
            setNotificationPermission("denied");
            return;
        }

        let permission: NotificationPermission = Notification.permission;
        if (permission === "default") {
            permission = await Notification.requestPermission();
        }
        setNotificationPermission(permission);

        if (permission !== "granted") {
            alert(t.notifications_permission_hint);
            return;
        }

        await setNotificationsEnabled(true);
    };

    const openInfoPage = (path: "/about" | "/privacy") => {
        window.location.assign(path);
    };

    const toInputDateUTC = (date: Date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollTop = e.currentTarget.scrollTop;

        // Only trigger if scroll distance is significant (> 10px)
        if (Math.abs(currentScrollTop - lastScrollTop) < 20) return;

        if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
            // Scrolling down
            setShowFab(false);
        } else {
            // Scrolling up
            setShowFab(true);
        }
        setLastScrollTop(currentScrollTop);
    };

    const handleAddOrEdit = async (data: CelebrationFormData) => {
        if (data.id) {
            await updateCelebration(data.id, {
                title: data.title,
                rawDate: data.rawDate,
                type: data.type,
                customTypeLabel: data.customTypeLabel
            });
        } else {
            await addCelebration({
                title: data.title,
                rawDate: data.rawDate,
                type: data.type,
                customTypeLabel: data.customTypeLabel
            });
            await playCelebrationChime();
        }
    };

    const openEditModal = (celebration: EditableCelebration) => {
        setEditingCelebration(celebration);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingCelebration(null);
        if (activeTab === "calendar") {
            const year = calendarMonthStart.getUTCFullYear();
            const month = calendarMonthStart.getUTCMonth();
            const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
            const pickedDay = Math.min(Math.max(selectedCalendarDay ?? 1, 1), daysInMonth);
            setAddModalDefaultDate(toInputDateUTC(new Date(Date.UTC(year, month, pickedDay))));
        } else {
            setAddModalDefaultDate("");
        }
        setIsModalOpen(true);
    };

    const openSendGreetingModal = (celebration: SendGreetingTarget) => {
        setSendingCelebration(celebration);
        setIsSendGreetingModalOpen(true);
    };

    const getCalendarEventDotColor = (type: Celebration["type"]) => {
        switch (type) {
            case "birthday":
                return "bg-pink-400";
            case "anniversary":
                return "bg-cyan-400";
            case "retirement":
                return "bg-slate-400";
            case "graduation":
                return "bg-violet-400";
            case "baby_shower":
                return "bg-sky-400";
            case "wedding":
                return "bg-rose-400";
            case "get_well_soon":
                return "bg-emerald-400";
            case "house_warming":
                return "bg-amber-400";
            case "custom":
                return "bg-indigo-400";
            default:
                return "bg-cyan-400";
        }
    };

    const getDefaultSelectedDay = (monthStart: Date, items: Celebration[]) => {
        const month = monthStart.getUTCMonth();
        const year = monthStart.getUTCFullYear();
        const now = new Date();
        if (now.getUTCFullYear() === year && now.getUTCMonth() === month) {
            return now.getUTCDate();
        }

        const firstEventDay = items
            .filter((item) => {
                const date = new Date(item.rawDate);
                if (Number.isNaN(date.getTime())) return false;
                if (date.getUTCMonth() !== month) return false;
                const itemYear = date.getUTCFullYear();
                return itemYear <= year;
            })
            .map((item) => new Date(item.rawDate).getUTCDate())
            .sort((a, b) => a - b)[0];

        return firstEventDay || 1;
    };

    const shiftCalendarMonth = (monthDelta: number) => {
        setCalendarMonthStart((previous) => {
            const next = new Date(Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth() + monthDelta, 1));
            setSelectedCalendarDay(getDefaultSelectedDay(next, celebrations));
            return next;
        });
    };

    const goToTodayCalendar = () => {
        const today = new Date();
        setCalendarMonthStart(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));
        setSelectedCalendarDay(today.getUTCDate());
    };

    if (authLoading || dataLoading) return (
        <div className="min-h-[100dvh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <AuthPage />;

    const renderHeader = () => {
        let title = "Congratss";
        if (activeTab === "calendar") title = t.calendar;
        if (activeTab === "settings") title = t.settings;
        if (activeTab === "admin") title = t.admin_console;

        return (
            <header className="px-6 py-4 flex justify-between items-center bg-white/[0.05] dark:bg-white/[0.02] backdrop-blur-md border-b border-black/5 dark:border-white/5 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-4">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">{title}</h1>
                <div className="w-9 h-9 rounded-full border-2 border-black/10 dark:border-white/20 overflow-hidden shadow-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random&color=fff&size=100`}
                        alt={t.profile_image_alt}
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (
                    <div className="relative flex-1 overflow-hidden">
                        {isDarkMode && (
                            <>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
                            </>
                        )}

                        <div className="relative z-10 h-full flex flex-col pt-1">
                            <div className="px-8 mb-8">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-neon-cyan/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-dim)] z-10" />
                                    <input
                                        type="text"
                                        placeholder={t.search_placeholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-5 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:border-cyan-400/50 dark:focus:border-neon-cyan/40 focus:bg-[var(--glass-bg)] transition-all duration-300 relative z-10 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto px-8 scrollbar-hide pb-24 relative"
                            >
                                <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                {filteredCelebrations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                            <Plus className="w-10 h-10 text-[var(--app-text-muted)]" />
                                        </div>
                                        <h3 className="text-lg font-medium text-[var(--app-text-dim)]">
                                            {searchQuery ? t.no_matches : t.no_celebrations}
                                        </h3>
                                        <p className="text-sm text-[var(--app-text-muted)] px-6">
                                            {searchQuery ? t.try_different_search : t.add_first}
                                        </p>
                                    </div>
                                ) : (
                                    filteredCelebrations.map((item) => (
                                        <CelebrationCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            daysLeft={item.daysLeft}
                                            date={item.date}
                                            rawDate={item.rawDate}
                                            percentage={item.percentage}
                                            type={item.type}
                                            customTypeLabel={item.customTypeLabel}
                                            onDelete={handleDeleteClick}
                                            onEdit={openEditModal}
                                            onSendGreeting={openSendGreetingModal}
                                        />
                                    ))
                                )}


                            </div>
                            </div>
                        </div>
                );

            case "calendar":
                const year = calendarMonthStart.getUTCFullYear();
                const month = calendarMonthStart.getUTCMonth();
                const locale = language === "es" ? "es-ES" : "en-US";
                const weekDays = language === "es" ? ["D", "L", "M", "X", "J", "V", "S"] : ["S", "M", "T", "W", "T", "F", "S"];
                const monthLabel = calendarMonthStart.toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
                const isLightMode = theme === "light";

                const firstOfMonth = new Date(Date.UTC(year, month, 1));
                const startOffset = firstOfMonth.getUTCDay();
                const gridStart = new Date(Date.UTC(year, month, 1 - startOffset));

                const monthCells = Array.from({ length: 42 }, (_, index) => {
                    const date = new Date(gridStart);
                    date.setUTCDate(gridStart.getUTCDate() + index);
                    return {
                        date,
                        day: date.getUTCDate(),
                        inMonth: date.getUTCMonth() === month,
                    };
                });

                const celebrationsByDay = celebrations.reduce<Record<number, Celebration[]>>((acc, item) => {
                    const itemDate = new Date(item.rawDate);
                    if (Number.isNaN(itemDate.getTime())) return acc;
                    if (itemDate.getUTCMonth() !== month) return acc;

                    const itemYear = itemDate.getUTCFullYear();
                    const isRecurring = itemYear <= year;
                    if (!isRecurring && itemYear !== year) return acc;

                    const day = itemDate.getUTCDate();
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(item);
                    return acc;
                }, {});

                const monthEvents = Object.values(celebrationsByDay).flat()
                    .sort((a, b) => a.daysLeft - b.daysLeft)
                    .slice(0, 4);

                const now = new Date();
                const todayDay = now.getUTCDate();
                const isCurrentMonth = now.getUTCFullYear() === year && now.getUTCMonth() === month;
                const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
                const selectedDay = selectedCalendarDay && selectedCalendarDay >= 1 && selectedCalendarDay <= daysInMonth
                    ? selectedCalendarDay
                    : getDefaultSelectedDay(calendarMonthStart, celebrations);
                const selectedDayEvents = celebrationsByDay[selectedDay] || [];
                const selectedDateLabel = new Date(Date.UTC(year, month, selectedDay)).toLocaleDateString(locale, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                });

                return (
                    <div className="relative flex-1 overflow-hidden">
                        {isDarkMode && (
                            <>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
                            </>
                        )}
                        <div
                            onScroll={handleScroll}
                            className="relative z-10 h-full overflow-y-auto px-4 scrollbar-hide py-4 sm:px-6"
                        >
                            <div className={`rounded-3xl border overflow-hidden ${isLightMode ? "bg-white border-slate-200 shadow-sm" : "bg-[#151820] border-slate-700"}`}>
                            <div className={`px-4 py-4 border-b flex items-center justify-between ${isLightMode ? "border-slate-200" : "border-slate-700"}`}>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>{t.calendar_view_label}</p>
                                    <h3 className={`text-lg font-semibold capitalize ${isLightMode ? "text-slate-900" : "text-slate-100"}`}>{monthLabel}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={goToTodayCalendar}
                                        className={`px-2.5 h-8 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors ${isLightMode ? "border-slate-300 text-slate-600 hover:bg-slate-100" : "border-slate-600 text-slate-300 hover:bg-slate-800"}`}
                                    >
                                        {t.calendar_today}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => shiftCalendarMonth(-1)}
                                        className={`w-8 h-8 rounded-lg border grid place-items-center transition-colors ${isLightMode ? "border-slate-300 text-slate-600 hover:bg-slate-100" : "border-slate-600 text-slate-300 hover:bg-slate-800"}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => shiftCalendarMonth(1)}
                                        className={`w-8 h-8 rounded-lg border grid place-items-center transition-colors ${isLightMode ? "border-slate-300 text-slate-600 hover:bg-slate-100" : "border-slate-600 text-slate-300 hover:bg-slate-800"}`}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className={`text-center text-[10px] font-bold uppercase tracking-widest ${isLightMode ? "text-slate-500" : "text-slate-400"}`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {monthCells.map((cell) => {
                                        const items = cell.inMonth ? celebrationsByDay[cell.day] || [] : [];
                                        const isToday = isCurrentMonth && cell.inMonth && cell.day === todayDay;
                                        const isSelected = cell.inMonth && cell.day === selectedDay;

                                        return (
                                            <button
                                                type="button"
                                                key={`${cell.date.toISOString()}-${cell.day}`}
                                                onClick={() => {
                                                    if (!cell.inMonth) {
                                                        setCalendarMonthStart(new Date(Date.UTC(cell.date.getUTCFullYear(), cell.date.getUTCMonth(), 1)));
                                                    }
                                                    setSelectedCalendarDay(cell.day);
                                                }}
                                                className={`min-h-14 p-2 rounded-xl border ${cell.inMonth
                                                    ? isLightMode
                                                        ? "border-slate-200 bg-white"
                                                        : "border-slate-700 bg-[#1e2430]"
                                                    : isLightMode
                                                        ? "border-slate-100 bg-slate-50 opacity-60"
                                                        : "border-slate-800 bg-slate-900/70 opacity-55"
                                                    } ${isSelected
                                                        ? isLightMode
                                                            ? "ring-2 ring-slate-900"
                                                            : "ring-2 ring-cyan-400"
                                                        : ""
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`text-xs ${isToday
                                                            ? isLightMode
                                                                ? "px-1.5 py-0.5 rounded-md bg-slate-900 text-white font-bold"
                                                                : "px-1.5 py-0.5 rounded-md bg-cyan-400 text-black font-bold"
                                                            : isLightMode
                                                                ? "text-slate-700"
                                                                : "text-slate-200"
                                                            }`}
                                                    >
                                                        {cell.day}
                                                    </span>
                                                    {items.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            {items.slice(0, 2).map((event, idx) => (
                                                                <span
                                                                    key={`${event.id}-${idx}`}
                                                                    className={`w-1.5 h-1.5 rounded-full ${getCalendarEventDotColor(event.type)}`}
                                                                />
                                                            ))}
                                                            {items.length > 2 && <span className={`text-[9px] ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>+{items.length - 2}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                                {items.length > 0 && (
                                                    <p className={`mt-1 text-[9px] leading-tight text-left truncate ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                                                        {items[0].title}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={`mx-4 mb-4 rounded-2xl border p-3 ${isLightMode ? "border-slate-200 bg-white" : "border-slate-700 bg-[#1b212d]"}`}>
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>{selectedDateLabel}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                                        {monthEvents.length} {t.calendar_this_month}
                                    </span>
                                </div>
                                {selectedDayEvents.length === 0 ? (
                                    <div className={`flex items-center gap-2 text-xs ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{t.calendar_no_events_day}</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDayEvents.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`w-2 h-2 rounded-full ${getCalendarEventDotColor(item.type)}`} />
                                                    <p className={`text-xs truncate ${isLightMode ? "text-slate-700" : "text-slate-100"}`}>{item.title}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEditModal({ id: item.id, title: item.title, rawDate: item.rawDate, type: item.type, customTypeLabel: item.customTypeLabel })}
                                                        className={`p-2 rounded-lg border transition-colors ${isLightMode
                                                            ? "border-slate-300 text-slate-600 hover:bg-slate-100"
                                                            : "border-slate-600 text-slate-200 hover:bg-slate-700"
                                                            }`}
                                                        aria-label={t.edit_celebration_aria}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        className={`p-2 rounded-lg border transition-colors ${isLightMode
                                                            ? "border-red-300 text-red-600 hover:bg-red-50"
                                                            : "border-red-500/40 text-red-400 hover:bg-red-500/10"
                                                            }`}
                                                        aria-label={t.delete_celebration_aria}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openSendGreetingModal(item)}
                                                        className={`p-2 rounded-lg border transition-colors ${isLightMode
                                                            ? "border-slate-300 text-slate-600 hover:bg-slate-100"
                                                            : "border-slate-600 text-slate-200 hover:bg-slate-700"
                                                            }`}
                                                        aria-label={t.share_celebration_aria}
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="relative flex-1 overflow-hidden">
                        {isDarkMode && (
                            <>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
                            </>
                        )}
                        <div className="relative z-10 h-full overflow-y-auto px-8 py-8 scrollbar-hide">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-24 h-24 rounded-[2rem] border-4 border-black/10 dark:border-white/10 overflow-hidden shadow-2xl mb-4 relative group bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random&color=fff&size=256`}
                                    alt={t.profile_image_alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--app-text)]">{user.displayName || t.default_user_name}</h3>
                            <p className="text-sm text-[var(--app-text-dim)]">{user.email}</p>
                            {isAdmin && (
                                <div className="mt-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full">
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{t.admin_access}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-[0.2em] px-2">{t.account}</h4>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="w-full glass-card p-4 flex items-center justify-between text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors premium-border neon-border-cyan"
                            >
                                <span className="text-sm font-medium">{t.edit_profile}</span>
                                <Settings className="w-4 h-4 opacity-70" />
                            </button>

                            {/* Language Selector */}
                            <div className="glass-card p-4 flex flex-col gap-3 premium-border neon-border-cyan">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[var(--app-text-dim)]">{t.language}</span>
                                    <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                        <button
                                            onClick={() => setLanguage("en")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "en" ? "bg-cyan-400 text-black shadow-neon" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() => setLanguage("es")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "es" ? "bg-cyan-400 text-black shadow-neon" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                                        >
                                            ES
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleNotifications}
                                className="w-full glass-card p-4 flex items-center justify-between text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors premium-border neon-border-cyan"
                            >
                                <span className="text-sm font-medium">{t.notifications}</span>
                                <div className="flex flex-col items-end gap-1">
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${notificationsEnabled ? "bg-cyan-400/35" : "bg-black/10 dark:bg-white/15"}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${notificationsEnabled ? "right-0.5 bg-cyan-400 shadow-neon" : "left-0.5 bg-slate-500"}`} />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-[var(--app-text-muted)]">
                                        {notificationsEnabled ? t.notifications_on : t.notifications_off}
                                    </span>
                                </div>
                            </button>
                            {notificationPermission === "denied" && (
                                <p className="text-[10px] text-red-500/80 px-2">
                                    {t.notifications_blocked}
                                </p>
                            )}

                            <div className="glass-card p-4 flex flex-col gap-3 premium-border neon-border-cyan">
                                <h4 className="text-[10px] font-bold text-[var(--app-text-muted)] uppercase tracking-[0.2em]">{t.legal_info}</h4>
                                <button
                                    type="button"
                                    onClick={() => openInfoPage("/about")}
                                    className="w-full flex items-center justify-between text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors"
                                >
                                    <span className="text-sm font-medium">{t.about_app}</span>
                                    <Info className="w-4 h-4 opacity-70" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openInfoPage("/privacy")}
                                    className="w-full flex items-center justify-between text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors"
                                >
                                    <span className="text-sm font-medium">{t.privacy_policy}</span>
                                    <Shield className="w-4 h-4 opacity-70" />
                                </button>
                            </div>

                            {/* Theme Toggle */}
                            <div className="glass-card p-4 flex flex-col gap-3 premium-border neon-border-cyan">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[var(--app-text-dim)]">{t.theme}</span>
                                    <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                        <button
                                            onClick={() => theme === "light" && toggleTheme()}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${theme === "dark" ? "bg-neon-cyan text-black shadow-neon-sm" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                            {t.dark.toUpperCase()}
                                        </button>
                                        <button
                                            onClick={() => theme === "dark" && toggleTheme()}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${theme === "light" ? "bg-neon-cyan text-black shadow-neon-sm" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            {t.light.toUpperCase()}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={logout}
                                className="w-full py-4 rounded-2xl bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/20 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                {t.sign_out}
                            </button>
                        </div>
                        </div>
                    </div>
                );

            case "admin":
                return <AdminDashboard />;

            default:
                return null;
        }
    };

    return (
        <main className="h-[100dvh] min-h-[100dvh] bg-[var(--app-bg)] flex flex-col items-center justify-start overflow-x-hidden overflow-y-hidden transition-colors duration-500">
            <div
                onScroll={handleScroll}
                className="glass-pane w-full sm:max-w-md h-[100dvh] sm:h-[850px] sm:my-8 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
                {dataError && (
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-red-500/10 border-b border-red-500/20 backdrop-blur-md text-red-600 dark:text-red-200 text-xs text-center">
                        <p>{t.database_error_prefix}: {dataError}</p>
                    </div>
                )}

                {renderHeader()}
                {renderContent()}

                {/* Floating Action Button - Only show on home and calendar */}
                {(activeTab === "home" || activeTab === "calendar") && (
                    <button
                        onClick={openAddModal}
                        className={`fixed z-50 w-16 h-16 rounded-[2rem] bg-neon-cyan text-black flex items-center justify-center shadow-neon hover:brightness-110 hover:scale-110 active:scale-95 transition-all duration-500 left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] sm:left-auto sm:right-8 sm:translate-x-0 sm:bottom-28 ${showFab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}
                    >
                        <Plus className="w-8 h-8 font-black" />
                    </button>
                )}

                <nav className="bg-[var(--pane-bg)] backdrop-blur-3xl border-t border-black/5 dark:border-white/20 flex items-start justify-around px-4 z-30 pwa-nav-spacer">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" ? "text-neon-cyan scale-110" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                    >
                        <HomeIcon className={`w-6 h-6 ${activeTab === "home" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_home}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "calendar" ? "text-neon-cyan scale-110" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                    >
                        <CalendarIcon className={`w-6 h-6 ${activeTab === "calendar" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_calendar}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "settings" ? "text-neon-cyan scale-110" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                    >
                        <Settings className={`w-6 h-6 ${activeTab === "settings" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_settings}</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab("admin")}
                            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "admin" ? "text-neon-cyan scale-110" : "text-[var(--app-text-dim)] hover:text-[var(--app-text)]"}`}
                        >
                            <Plus className={`w-6 h-6 rotate-45 ${activeTab === "admin" ? "fill-neon-cyan/20" : ""}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t.admin}</span>
                        </button>
                    )}
                </nav>
            </div>

            <AddCelebrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddOrEdit}
                initialData={editingCelebration}
                defaultDate={addModalDefaultDate}
            />

            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                onUpdate={handleUpdateProfile}
                currentData={{
                    displayName: user.displayName || "",
                    photoURL: user.photoURL || ""
                }}
            />

            <SendGreetingModal
                isOpen={isSendGreetingModalOpen}
                onClose={() => setIsSendGreetingModalOpen(false)}
                celebration={sendingCelebration}
            />

            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </main>
    );
}
