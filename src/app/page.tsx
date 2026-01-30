"use client";

import React, { useState } from "react";
import { Plus, Home as HomeIcon, Calendar as CalendarIcon, Settings, Search, LogOut } from "lucide-react";
import CelebrationCard from "@/components/CelebrationCard";
import AddCelebrationModal from "@/components/AddCelebrationModal";
import { useAuth } from "@/context/AuthContext";
import { useCelebrations } from "@/hooks/useCelebrations";
import AuthPage from "./auth/page";

export default function Home() {
    const { user, loading: authLoading, logout } = useAuth();
    const { celebrations, loading: dataLoading, error: dataError, addCelebration, updateCelebration, deleteCelebration } = useCelebrations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCelebration, setEditingCelebration] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("home");

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

    if (authLoading || dataLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <AuthPage />;

    return (
        <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
            {/* Central Glass Container */}
            <div className="glass-pane w-full max-w-md h-[850px] overflow-hidden flex flex-col relative">

                {/* Optional Error Banner */}
                {dataError && (
                    <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-red-500/20 border-b border-red-500/50 backdrop-blur-md text-red-200 text-xs text-center">
                        <p>Database Error: {dataError}</p>
                    </div>
                )}

                {/* Header */}
                <header className="p-8 pb-4 flex justify-between items-center bg-white/5 backdrop-blur-md">
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">Celebrations</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={logout} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shadow-lg">
                            <img
                                src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="px-8 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search celebrations..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20"
                        />
                    </div>
                </div>

                {/* Celebrations List */}
                <div className="flex-1 overflow-y-auto px-8 scrollbar-hide pb-24">
                    {celebrations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Plus className="w-10 h-10 text-white/20" />
                            </div>
                            <h3 className="text-lg font-medium text-white/60">No celebrations yet</h3>
                            <p className="text-sm text-white/30 px-6">Click the button below to add your first special moment.</p>
                        </div>
                    ) : (
                        celebrations.map((item) => (
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

                {/* Floating Action Button */}
                <button
                    onClick={openAddModal}
                    className="absolute bottom-24 right-8 w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-neon transition-transform active:scale-95 hover:scale-105 z-20 group"
                >
                    <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.6)] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.8)] transition-all">
                        <Plus className="text-black w-8 h-8" />
                    </div>
                    <span className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-tighter text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Add New</span>
                </button>

                {/* Navigation Bar */}
                <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/10 backdrop-blur-3xl border-t border-white/20 flex items-center justify-around px-8">
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

            {/* Modal */}
            <AddCelebrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddOrEdit}
                initialData={editingCelebration}
            />
        </main>
    );
}
