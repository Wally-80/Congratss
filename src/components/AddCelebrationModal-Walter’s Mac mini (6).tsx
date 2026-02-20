"use client";

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Gift, Heart, Clock, Loader2 } from 'lucide-react';
import { celebrationService } from '@/lib/celebrationService';
import { useAuth } from '@/context/AuthContext';

interface AddCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCelebrationModal({ isOpen, onClose }: AddCelebrationModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'birthday' as const,
        date: '',
        isRecurring: true,
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await celebrationService.addCelebration({
                userId: user.uid,
                name: formData.name,
                type: formData.type,
                date: new Date(formData.date),
                isRecurring: formData.isRecurring,
                notes: formData.notes
            });
            onClose();
            setFormData({ name: '', type: 'birthday', date: '', isRecurring: true, notes: '' });
        } catch (error) {
            alert("Failed to add celebration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4">
            <div className="glass w-full max-w-md overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Add New</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Celebration</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Friend or Occasion Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Jane's Birthday"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                    </div>

                    {/* Type Selection */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'birthday', icon: Gift, label: 'Birthday' },
                            { id: 'anniversary', icon: Heart, label: 'Anniversary' },
                            { id: 'retirement', icon: Clock, label: 'Retirement' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: item.id as any })}
                                className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all border ${formData.type === item.id
                                        ? 'bg-white/10 border-white/20 text-white shadow-lg'
                                        : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${formData.type === item.id ? 'animate-bounce' : ''}`} />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Date Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            'Save Celebration'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
