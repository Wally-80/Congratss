"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Image as ImageIcon, Save, X, PlusCircle, Upload, Loader2 } from "lucide-react";
import { cardService, GreetingCard } from "@/lib/cardService";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";
import { uploadFile } from "@/lib/storageService";

export default function AdminDashboard() {
    const [cards, setCards] = useState<GreetingCard[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: "", url: "", category: "Classic" });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isBulkUploading, setIsBulkUploading] = useState(false);
    const { language } = useAuth();
    const t = translations[language];

    // Confirmation States
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = cardService.subscribeToCards((data) => {
            setCards(data);
        });
        return () => unsubscribe();
    }, []);

    const categories = Array.from(new Set(cards.map(c => c.category))).sort();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        try {
            const url = await uploadFile(file, "greeting_cards", (progress) => {
                setUploadProgress(progress);
            });
            setFormData(prev => ({ ...prev, url }));
            alert(t.upload_success);
        } catch (error) {
            console.error("Upload error:", error);
            alert(t.upload_failed);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsBulkUploading(true);
        setLoading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const label = file.name.split('.').slice(0, -1).join('.') || file.name;
                const url = await uploadFile(file, "greeting_cards");
                await cardService.addCard({
                    label: label,
                    url: url,
                    category: "New"
                });
            }
            alert(language === "es" ? "Â¡Tarjetas creadas con Ã©xito!" : "Cards created successfully!");
        } catch (error) {
            console.error("Bulk upload error:", error);
            alert(t.upload_failed);
        } finally {
            setIsBulkUploading(false);
            setLoading(false);
            // Reset input
            e.target.value = "";
        }
    };

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
            alert(language === "es" ? "Error al guardar la tarjeta. Revisa la consola." : "Error saving card. Check console.");
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
    const cancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ label: "", url: "", category: "Classic" });
    };

    return (
        <div className="relative flex-1 flex flex-col overflow-hidden">
            <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#23324a_0%,_#151820_45%,_#111622_100%)]" />
            <div className="hidden dark:block absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_10%,_#2b4a6a_0%,_transparent_40%)]" />
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-white/10 dark:border-white/10 flex justify-between items-center bg-[var(--pane-bg)]">
                <div className="hidden sm:block">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--app-text)]">{t.admin_console}</h2>
                    <p className="text-[10px] text-[var(--app-text-dim)] uppercase tracking-widest">{t.library_management}</p>
                </div>
                {!isAdding && (
                    <div className="flex gap-2">
                        <label className="flex items-center gap-2 px-4 py-2 bg-white/5 dark:bg-white/5 text-[var(--app-text-dim)] border border-dashed border-cyan-400/30 rounded-xl font-bold text-xs hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/50 transition-all cursor-pointer">
                            {isBulkUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {isBulkUploading ? t.processing_files : t.quick_upload}
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleQuickUpload}
                                disabled={isBulkUploading}
                                accept="image/*,video/*"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-xl font-bold text-xs shadow-neon hover:brightness-110 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            {t.add_new_card}
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                {isAdding ? (
                    <div className="glass-card p-6 animate-in fade-in slide-in-from-top-4 duration-300 premium-border neon-border-cyan">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[var(--app-text)]">
                                {editingId ? t.edit_card : t.build_new_card}
                            </h3>
                            <button
                                type="button"
                                aria-label="Close editor"
                                onClick={cancel}
                                className="w-10 h-10 grid place-items-center rounded-full text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--app-text-dim)] uppercase tracking-widest block mb-1.5 ml-1">{t.card_label}</label>
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
                                <label className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest block mb-1.5 ml-1">{t.image_url}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="e.g. /greeting_new.png"
                                        className="flex-1 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                                    />
                                    <label className="flex items-center justify-center px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-all group">
                                        {uploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-[var(--app-text-dim)] group-hover:text-cyan-400" />
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                {uploading && (
                                    <div className="mt-2 h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-cyan-400 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                            </div>


                            <div>
                                <label className="text-[10px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest block mb-1.5 ml-1">{t.category}</label>
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
                                        placeholder={language === "es" ? "O escribe una nueva..." : "Or type custom..."}
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
                                    {loading ? t.processing : (editingId ? t.update : t.publish_card)}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancel}
                                    className="px-6 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 py-3 rounded-xl font-bold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                                >
                                    {t.cancel}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                <ImageIcon className="w-16 h-16 mb-4" />
                                <p>{t.library_empty}</p>
                            </div>
                        ) : (
                            categories.map(category => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-900/70 dark:text-white/30 uppercase tracking-[0.2em] ml-1">{category}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {cards.filter(c => c.category === category).map(card => (
                                            <div key={card.id} className="glass-card p-2 group overflow-hidden premium-border neon-border-cyan">
                                                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                                    <img src={card.url} alt={card.label} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/45 opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto transition-opacity flex items-start justify-end gap-2 p-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(card)}
                                                            className="p-2 bg-black/35 sm:bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-cyan-400 hover:text-black transition-all"
                                                            aria-label="Edit card"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteClick(card.id)}
                                                            className="p-2 bg-black/35 sm:bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                                                            aria-label="Delete card"
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
                        {language === "es" ? "Cualquier cambio hecho aquÃ­ serÃ¡ visible para todos los usuarios en el menÃº 'Elegir y Enviar' al instante vÃ­a Firestore." : "Any changes made here will be visible to all users in the \"Pick & Send\" menu instantly via Firestore sync."}
                    </p>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t.delete_card_title}
                message={t.delete_card_msg}
            />
            </div>
        </div>
    );
}

