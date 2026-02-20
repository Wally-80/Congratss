"use client";

import React, { useState } from "react";
import { X, Gift, Heart, User } from "lucide-react";

interface AddCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
    initialData?: { id: string, title: string, rawDate: string, type: string } | null;
}

export default function AddCelebrationModal({ isOpen, onClose, onAdd, initialData }: AddCelebrationModalProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<"birthday" | "anniversary" | "retirement">("birthday");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate fields when editing
    React.useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDate(initialData.rawDate);
            setType(initialData.type as any);
        } else {
            setTitle("");
            setDate("");
            setType("birthday");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await onAdd({
            id: initialData?.id, // Pass ID back if updating
            title,
            rawDate: date,
            type: type,
        });

        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="glass-pane w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-white/90">Add Celebration</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Walter's Birthday"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-widest">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            style={{ colorScheme: 'dark' }}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/40 mb-4 uppercase tracking-widest">Event Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setType("birthday")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${type === "birthday" ? "bg-neon-pink/20 border-neon-pink text-neon-pink" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                            >
                                <Gift className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Birthday</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("anniversary")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${type === "anniversary" ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                            >
                                <Heart className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Anniv.</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("retirement")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${type === "retirement" ? "bg-white/20 border-white text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                            >
                                <User className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Retire.</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 mt-8"
                    >
                        {isSubmitting ? "Processing..." : (initialData ? "Update Celebration" : "Save Celebration")}
                    </button>
                </form>
            </div>
        </div>
    );
}
