"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Image as ImageIcon, Save, X, PlusCircle } from "lucide-react";
import { cardService, GreetingCard } from "@/lib/cardService";
import ConfirmModal from "./ConfirmModal";

export default function AdminDashboard() {
    const [cards, setCards] = useState<GreetingCard[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: "", url: "", category: "Classic" });
    const [loading, setLoading] = useState(false);

    // Confirmation States
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = cardService.subscribeToCards((data) => {
            setCards(data);
        });
        return () => unsubscribe();
    }, []);

    const categories = Array.from(new Set(cards.map(c => c.category))).sort();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await cardService.updateCard(editingId, formData);
                setEditingId(null);
            } else {
                await cardService.addCard(formData);
                setIsAdding(false);
            }
            setFormData({ label: "", url: "", category: "Classic" });
        } catch (error) {
            alert("Error saving card. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (card: GreetingCard) => {
        setEditingId(card.id);
        setFormData({ label: card.label, url: card.url, category: card.category });
        setIsAdding(true);
    };

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await cardService.deleteCard(itemToDelete);
            setItemToDelete(null);
        }
    };

    const handleRestoreConfirm = async () => {
        setLoading(true);
        try {
            await cardService.seedDefaults();
            alert("Gallery restored successfully!");
        } catch (e) {
            alert("Restoration failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    const cancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ label: "", url: "", category: "Classic" });
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--app-bg)]">
            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-white/10 dark:border-white/10 flex justify-between items-center bg-[var(--pane-bg)]">
                <div className="hidden sm:block">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--app-text)]">Admin Console</h2>
                    <p className="text-[10px] text-[var(--app-text-dim)] uppercase tracking-widest">Library Management</p>
                </div>
                {!isAdding && (
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                if (confirm("Do you want to restore the 12 original Congratss cards?")) {
                                    setLoading(true);
                                    try {
                                        await cardService.seedDefaults();
                                        alert("Gallery restored successfully!");
                                    } catch (e) {
                                        alert("Restoration failed. See console.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-[var(--app-text-dim)] border border-black/10 dark:border-white/10 rounded-xl font-bold text-xs hover:bg-black/10 dark:hover:bg-white/10 hover:text-[var(--app-text)] transition-all"
                        >
                            Restore Defaults
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-xl font-bold text-xs shadow-neon hover:brightness-110 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add New Card
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                {isAdding ? (
                    <div className="glass-card p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[var(--app-text)]">
                                {editingId ? "Edit Card" : "Build New Card"}
                            </h3>
                            <button onClick={cancel} className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-widest block mb-1.5 ml-1">Card Label</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g. Birthday Magic"
                                    className="w-full bg-[var(--app-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm text-[var(--app-text)] focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest block mb-1.5 ml-1">Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="e.g. /greeting_new.png"
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest block mb-1.5 ml-1">Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Classic", "Special", "Funny", "New"].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${formData.category === cat
                                                ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Or type custom..."
                                        value={["Classic", "Special", "Funny", "New"].includes(formData.category) ? "" : formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="col-span-2 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-cyan-400 transition-all mt-1 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-cyan-400 text-black py-3 rounded-xl font-bold text-sm shadow-neon hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? "Saving..." : editingId ? "Update Card" : "Publish Card"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancel}
                                    className="px-6 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 py-3 rounded-xl font-bold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                <ImageIcon className="w-16 h-16 mb-4" />
                                <p>Library is empty. Add your first greeting card!</p>
                            </div>
                        ) : (
                            categories.map(category => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-900/70 dark:text-white/30 uppercase tracking-[0.2em] ml-1">{category}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {cards.filter(c => c.category === category).map(card => (
                                            <div key={card.id} className="glass-card p-2 group overflow-hidden">
                                                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                                    <img src={card.url} alt={card.label} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(card)}
                                                            className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-cyan-400 hover:text-black transition-all"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(card.id)}
                                                            className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-900 dark:text-white/70 uppercase text-center truncate px-1">{card.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Admin Info Tip */}
            {!isAdding && (
                <div className="p-6 bg-blue-500/5 dark:bg-blue-500/10 border-t border-black/5 dark:border-white/5">
                    <p className="text-[10px] text-blue-600 dark:text-blue-300/60 leading-relaxed italic text-center">
                        Any changes made here will be visible to all users in the "Pick & Send" menu instantly via Firestore sync.
                    </p>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Custom Card?"
                message="Are you sure you want to remove this greeting card from the public library?"
            />

            <ConfirmModal
                isOpen={isRestoreConfirmOpen}
                onClose={() => setIsRestoreConfirmOpen(false)}
                onConfirm={handleRestoreConfirm}
                isDangerous={false}
                title="Restore Default Gallery?"
                message="This will add the 12 original Congratss cards back to your library. Existing custom cards will be kept."
                confirmText="RESTORE NOW"
            />
        </div>
    );
}
