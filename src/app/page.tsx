"use client";

import React, { useState } from "react";
import { Plus, Home as HomeIcon, Calendar as CalendarIcon, Settings, Search, LogOut } from "lucide-react";
import CelebrationCard from "@/components/CelebrationCard";
import AddCelebrationModal from "@/components/AddCelebrationModal";
import EditProfileModal from "@/components/EditProfileModal";
import SendGreetingModal from "@/components/SendGreetingModal";
import { useAuth } from "@/context/AuthContext";
import { useCelebrations } from "@/hooks/useCelebrations";
import AuthPage from "./auth/page";

export default function Home() {
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const { user, loading: authLoading, logout, updateUserProfile } = useAuth();
    const { celebrations, loading: dataLoading, error: dataError, addCelebration, updateCelebration, deleteCelebration } = useCelebrations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSendGreetingModalOpen, setIsSendGreetingModalOpen] = useState(false);
    const [editingCelebration, setEditingCelebration] = useState<any>(null);
    const [sendingCelebration, setSendingCelebration] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("home");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCelebrations = celebrations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpdateProfile = async (displayName: string, photoURL: string) => {
        await updateUserProfile(displayName, photoURL);
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
        let title = "YupiFiesta";
        if (activeTab === "calendar") title = "Calendar";
        if (activeTab === "settings") title = "Settings";

        return (
            <header className="p-8 pb-4 flex justify-between items-center bg-white/5 backdrop-blur-md">
                <h1 className="text-3xl font-bold tracking-tight text-white/90">{title}</h1>
                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shadow-lg">
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
                        <div className="px-8 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search celebrations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 scrollbar-hide pb-8">
                            {filteredCelebrations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Plus className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white/60">
                                        {searchQuery ? "No matches found" : "No celebrations yet"}
                                    </h3>
                                    <p className="text-sm text-white/30 px-6">
                                        {searchQuery ? "Try a different search term" : "Click the button below to add your first special moment."}
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

                            {celebrations.length > 0 && (
                                <div className="mt-8 mb-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Upcoming</h2>
                                    <div className="glass-card flex items-center justify-between py-4 px-6 mb-4 opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <CalendarIcon className="w-5 h-5 text-white/60" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Review Planning</p>
                                                <p className="text-[10px] text-white/40 italic">System reminder</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                );

            case "calendar":
                const sortedByDate = [...celebrations].sort((a, b) => {
                    const dateA = new Date(a.rawDate).getTime();
                    const dateB = new Date(b.rawDate).getTime();
                    return dateA - dateB;
                });

                return (
                    <div className="flex-1 overflow-y-auto px-8 scrollbar-hide py-4">
                        <div className="space-y-8">
                            {sortedByDate.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <CalendarIcon className="w-16 h-16 mb-4" />
                                    <p>Your calendar is empty</p>
                                </div>
                            ) : (
                                sortedByDate.map((item) => (
                                    <div key={item.id} className="relative pl-8 border-l border-white/10 pb-4">
                                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
                                            {new Date(item.rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h4 className="text-white/90 font-medium mb-1">{item.title}</h4>
                                        <p className="text-xs text-white/40">{item.daysLeft} days to go</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                        <div className="glass-card p-6 text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-white/10 overflow-hidden mx-auto mb-4 shadow-2xl">
                                <img
                                    src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white/90">{user.displayName || "Yupi User"}</h3>
                            <p className="text-sm text-white/40">{user.email}</p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-2">Account</h4>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="w-full glass-card p-4 flex items-center justify-between text-white/70 hover:text-white transition-colors"
                            >
                                <span className="text-sm font-medium">Edit Profile</span>
                                <Settings className="w-4 h-4 opacity-40" />
                            </button>
                            <button className="w-full glass-card p-4 flex items-center justify-between text-white/70 hover:text-white transition-colors">
                                <span className="text-sm font-medium">Notifications</span>
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
                                Sign Out
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
            <div className="glass-pane w-full max-w-md h-[850px] overflow-hidden flex flex-col relative">
                {dataError && (
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-red-500/20 border-b border-red-500/50 backdrop-blur-md text-red-200 text-xs text-center">
                        <p>Database Error: {dataError}</p>
                    </div>
                )}

                {renderHeader()}
                {renderContent()}

                {/* Floating Action Button - Only show on home and calendar */}
                {activeTab !== "settings" && (
                    <button
                        onClick={openAddModal}
                        className="absolute bottom-24 right-8 w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-neon transition-transform active:scale-95 hover:scale-105 z-20 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.6)] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.8)] transition-all">
                            <Plus className="text-black w-8 h-8" />
                        </div>
                        <span className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-tighter text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Add New</span>
                    </button>
                )}

                <nav className="h-20 bg-white/10 backdrop-blur-3xl border-t border-white/20 flex items-center justify-around px-8 z-30">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={`p-2 transition-colors ${activeTab === "home" ? "text-white" : "text-white/40 hover:text-white"}`}
                    >
                        <HomeIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`p-2 transition-colors ${activeTab === "calendar" ? "text-white" : "text-white/40 hover:text-white"}`}
                    >
                        <CalendarIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`p-2 transition-colors ${activeTab === "settings" ? "text-white" : "text-white/40 hover:text-white"}`}
                    >
                        <Settings className="w-6 h-6" />
                    </button>
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
