"use client";

import React, { useState, useEffect } from "react";
import { Plus, Home as HomeIcon, Calendar as CalendarIcon, Settings, Search, LogOut, Send } from "lucide-react";
import CelebrationCard from "@/components/CelebrationCard";
import AddCelebrationModal from "@/components/AddCelebrationModal";
import EditProfileModal from "@/components/EditProfileModal";
import SendGreetingModal from "@/components/SendGreetingModal";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/context/AuthContext";
import { useCelebrations } from "@/hooks/useCelebrations";
import { translations } from "@/lib/translations";
import AuthPage from "./auth/page";

export default function Dashboard() {
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
            <header className="px-6 py-4 flex justify-between items-center bg-white/[0.02] backdrop-blur-md border-b border-white/5 pwa-header-spacer">
                <h1 className="text-2xl font-bold tracking-tight text-white/90">{title}</h1>
                <div className="w-9 h-9 rounded-full border-2 border-white/20 overflow-hidden shadow-lg">
                    <img
                        src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
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
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                                <input
                                    type="text"
                                    placeholder={t.search_placeholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:outline-none focus:border-neon-cyan/40 focus:bg-white/[0.05] transition-all duration-300 relative z-10"
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
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Plus className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white/60">
                                        {searchQuery ? t.no_matches : t.no_celebrations}
                                    </h3>
                                    <p className="text-sm text-white/30 px-6">
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
                                        onDelete={deleteCelebration}
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
                                    <CalendarIcon className="w-16 h-16 mb-4" />
                                    <p>{t.no_celebrations}</p>
                                </div>
                            ) : (
                                sortedByDate.map((item) => (
                                    <div key={item.id} className="relative pl-8 border-l border-white/10 pb-4 group">
                                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
                                                    {new Date(item.rawDate).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <h4 className="text-white/90 font-medium mb-1">{item.title}</h4>
                                                <p className="text-xs text-white/40">{item.daysLeft} {t.days_to_go}</p>
                                            </div>
                                            <button
                                                onClick={() => openSendGreetingModal(item)}
                                                className="p-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-400/20"
                                            >
                                                <Send className="w-4 h-4" />
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
                            <div className="w-24 h-24 rounded-[2rem] border-4 border-white/10 overflow-hidden shadow-2xl mb-4 relative group">
                                <img
                                    src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white/90">{user.displayName || "Congratss User"}</h3>
                            <p className="text-sm text-white/40">{user.email}</p>
                            {isAdmin && (
                                <div className="mt-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full">
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Admin Access</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-2">Account</h4>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="w-full glass-card p-4 flex items-center justify-between text-white/70 hover:text-white transition-colors"
                            >
                                <span className="text-sm font-medium">{t.edit_profile}</span>
                                <Settings className="w-4 h-4 opacity-40" />
                            </button>

                            {/* Language Selector */}
                            <div className="glass-card p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-white/70">{t.language}</span>
                                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                                        <button
                                            onClick={() => setLanguage("en")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "en" ? "bg-cyan-400 text-black shadow-neon" : "text-white/40 hover:text-white/60"}`}
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() => setLanguage("es")}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === "es" ? "bg-cyan-400 text-black shadow-neon" : "text-white/40 hover:text-white/60"}`}
                                        >
                                            ES
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full glass-card p-4 flex items-center justify-between text-white/70 hover:text-white transition-colors">
                                <span className="text-sm font-medium">{t.notifications}</span>
                                <div className="w-8 h-4 bg-cyan-400/20 rounded-full relative">
                                    <div className="absolute right-0 top-0 w-4 h-4 bg-cyan-400 rounded-full shadow-neon" />
                                </div>
                            </button>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={logout}
                                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
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
        <main className="min-h-screen bg-[#030308] flex flex-col items-center justify-start overflow-x-hidden">
            <div
                onScroll={handleScroll}
                className="glass-pane w-full max-w-md h-[100dvh] sm:h-[850px] sm:my-8 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
                {dataError && (
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-red-500/20 border-b border-red-500/50 backdrop-blur-md text-red-200 text-xs text-center">
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

                <nav className="bg-white/10 backdrop-blur-3xl border-t border-white/20 flex items-center justify-around px-4 z-30 pwa-nav-spacer">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" ? "text-neon-cyan scale-110" : "text-white/30 hover:text-white/50"}`}
                    >
                        <HomeIcon className={`w-6 h-6 ${activeTab === "home" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_home}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "calendar" ? "text-neon-cyan scale-110" : "text-white/30 hover:text-white/50"}`}
                    >
                        <CalendarIcon className={`w-6 h-6 ${activeTab === "calendar" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_calendar}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === "settings" ? "text-neon-cyan scale-110" : "text-white/30 hover:text-white/50"}`}
                    >
                        <Settings className={`w-6 h-6 ${activeTab === "settings" ? "fill-neon-cyan/20" : ""}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav_settings}</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab("admin")}
                            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "admin" ? "text-neon-cyan scale-110" : "text-white/30 hover:text-white/50"}`}
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
        </main>
    );
}
