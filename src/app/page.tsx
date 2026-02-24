"use client";

import React, { useState, useEffect } from "react";
import { Plus, Home as HomeIcon, Calendar as CalendarIcon, Settings, Search, LogOut, Send } from "lucide-react";
import CelebrationCard from "@/components/CelebrationCard";
import AddCelebrationModal from "@/components/AddCelebrationModal";
import EditProfileModal from "@/components/EditProfileModal";
import SendGreetingModal from "@/components/SendGreetingModal";
import AdminDashboard from "@/components/AdminDashboard";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useCelebrations } from "@/hooks/useCelebrations";
import { translations } from "@/lib/translations";
import AuthPage from "./auth/page";
import { useTheme } from "@/context/ThemeContext";

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const { user, isAdmin, language, setLanguage, loading: authLoading, logout, updateUserProfile } = useAuth();
    const t = translations[language];

    const { celebrations, loading: dataLoading, error: dataError, addCelebration, updateCelebration, deleteCelebration } = useCelebrations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendGreetingModalOpen, setIsSendGreetingModalOpen] = useState(false);
    const [editingCelebration, setEditingCelebration] = useState<any>(null);
    const [sendingCelebration, setSendingCelebration] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("home");
    const [searchQuery, setSearchQuery] = useState("");
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [showFab, setShowFab] = useState(true);

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

    const filteredCelebrations = celebrations
        .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.daysLeft - b.daysLeft);

    const handleUpdateProfile = async (displayName: string, photoURL: string) => {
        await updateUserProfile(displayName, photoURL);
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

    const handleAddOrEdit = async (data: any) => {
        if (data.id) {
            await updateCelebration(data.id, { title: data.title, rawDate: data.rawDate, type: data.type });
        } else {
            await addCelebration({ title: data.title, rawDate: data.rawDate, type: data.type });
        }
    };

    const openEditModal = (celebration: any) => {
        setEditingCelebration(celebration);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingCelebration(null);
        setIsModalOpen(true);
    };

    const openSendGreetingModal = (celebration: any) => {
        setSendingCelebration(celebration);
        setIsSendGreetingModalOpen(true);
    };

    if (authLoading || dataLoading) return (
        <div className="min-h-screen flex items-center justify-center">
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
            <header className="px-6 py-4 flex justify-between items-center bg-white/[0.05] dark:bg-white/[0.02] backdrop-blur-md border-b border-black/5 dark:border-white/5 pwa-header-spacer">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">{title}</h1>
                <div className="w-9 h-9 rounded-full border-2 border-black/10 dark:border-white/20 overflow-hidden shadow-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random&color=fff&size=100`}
                        alt="Profile"
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
                    <>
                        <div className="px-8 mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-neon-cyan/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-dim)] z-10" />
                                <input
                                    type="text"
                                    placeholder={t.search_placeholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:border-cyan-400/50 dark:focus:border-neon-cyan/40 focus:bg-white dark:focus:bg-white/[0.05] transition-all duration-300 relative z-10 shadow-sm"
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
                                        {searchQuery ? "Try a different search term" : t.add_first}
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
                                        onDelete={handleDeleteClick}
                                        onEdit={openEditModal}
                                        onSendGreeting={openSendGreetingModal}
                                    />
                                ))
                            )}


                        </div>
                    </>
                );

            case "calendar":
                const sortedByDate = [...celebrations].sort((a, b) => a.daysLeft - b.daysLeft);

                return (
                    <div
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-8 scrollbar-hide py-4"
                    >
                        <div className="space-y-8">
                            {sortedByDate.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <CalendarIcon className="w-16 h-16 mb-4 text-[var(--app-text-muted)]" />
                                    <p className="text-[var(--app-text-dim)]">{t.no_celebrations}</p>
                                </div>
                            ) : (
                                sortedByDate.map((item) => (
                                    <div key={item.id} className="relative pl-8 border-l border-white/10 pb-4 group">
                                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
                                                    {new Date(item.rawDate).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                                                </p>
                                                <h4 className="text-[var(--app-text)] font-medium mb-1">{item.title}</h4>
                                                <p className="text-xs text-[var(--app-text-dim)]">{item.daysLeft} {t.days_to_go}</p>
                                            </div>
                                            <button
                                                onClick={() => openSendGreetingModal(item)}
                                                className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-2xl text-cyan-400 shadow-neon-sm transition-all hover:bg-cyan-400/20"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-24 h-24 rounded-[2rem] border-4 border-black/10 dark:border-white/10 overflow-hidden shadow-2xl mb-4 relative group bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random&color=fff&size=256`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-slate-950 dark:text-white/90">{user.displayName || "Congratss User"}</h3>
                            <p className="text-sm text-black/40 dark:text-white/40">{user.email}</p>
                            {isAdmin && (
                                <div className="mt-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full">
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Admin Access</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-[0.2em] px-2">Account</h4>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="w-full glass-card p-4 flex items-center justify-between text-slate-900 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <span className="text-sm font-medium">{t.edit_profile}</span>
                                <Settings className="w-4 h-4 opacity-40 dark:opacity-40" />
                            </button>

                            {/* Language Selector */}
                            <div className="glass-card p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-900 dark:text-white/70">{t.language}</span>
                                    <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                        <button
                                            onClick={() => setLanguage("en")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "en" ? "bg-cyan-400 text-black shadow-neon" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"}`}
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() => setLanguage("es")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "es" ? "bg-cyan-400 text-black shadow-neon" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"}`}
                                        >
                                            ES
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full glass-card p-4 flex items-center justify-between text-slate-900 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                                <span className="text-sm font-medium">{t.notifications}</span>
                                <div className="w-8 h-4 bg-black/5 dark:bg-cyan-400/20 rounded-full relative">
                                    <div className={`absolute ${true ? 'right-0' : 'left-0'} top-0 w-4 h-4 bg-cyan-400 rounded-full shadow-neon`} />
                                </div>
                            </button>

                            {/* Theme Toggle */}
                            <div className="glass-card p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-900 dark:text-white/70">Theme</span>
                                    <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                        <button
                                            onClick={() => theme === "light" && toggleTheme()}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${theme === "dark" ? "bg-neon-cyan text-black shadow-neon-sm" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"}`}
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                            DARK
                                        </button>
                                        <button
                                            onClick={() => theme === "dark" && toggleTheme()}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${theme === "light" ? "bg-neon-cyan text-black shadow-neon-sm" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"}`}
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            LIGHT
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
                );

            case "admin":
                return <AdminDashboard />;

            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-start overflow-x-hidden transition-colors duration-500">
            <div
                onScroll={handleScroll}
                className="glass-pane w-full sm:max-w-md h-[100dvh] sm:h-[850px] sm:my-8 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
                {dataError && (
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-red-500/10 border-b border-red-500/20 backdrop-blur-md text-red-600 dark:text-red-200 text-xs text-center">
                        <p>Database Error: {dataError}</p>
                    </div>
                )}

                {renderHeader()}
                {renderContent()}

                {/* Floating Action Button - Only show on home and calendar */}
                {(activeTab === "home" || activeTab === "calendar") && (
                    <button
                        onClick={openAddModal}
                        className={`fixed bottom-28 right-8 z-50 w-16 h-16 rounded-[2rem] bg-neon-cyan text-black flex items-center justify-center shadow-neon hover:brightness-110 hover:scale-110 active:scale-95 transition-all duration-500 ${showFab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}
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
