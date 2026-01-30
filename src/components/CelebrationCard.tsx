import { Gift, Calendar, Heart, Trash2, Pencil } from "lucide-react";
import CircularProgress from "./CircularProgress";

interface CelebrationCardProps {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string;
    percentage: number;
    type: "birthday" | "anniversary";
    onDelete?: (id: string) => void;
    onEdit?: (data: any) => void;
}

export default function CelebrationCard({ id, title, daysLeft, date, rawDate, percentage, type, onDelete, onEdit }: CelebrationCardProps) {
    const isBirthday = type === "birthday";
    const color = isBirthday ? "pink" : "cyan";
    const Icon = isBirthday ? Gift : Heart;

    return (
        <div className="glass-card flex items-center justify-between mb-4 relative group">
            <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                {onEdit && (
                    <button
                        onClick={() => onEdit({ id, title, rawDate, type })}
                        className="p-2 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-all"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(id)}
                        className="p-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-200 hover:bg-red-500/40 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white/90">{title}</h3>
                    <Icon className={`w-5 h-5 ${isBirthday ? "text-neon-pink" : "text-neon-cyan"}`} />
                </div>
                <p className="text-lg font-medium text-white/70 mb-4">{daysLeft} days left</p>
                <div className="flex items-center gap-2 text-white/40">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">{date}</span>
                </div>
            </div>

            <div className="ml-4">
                <CircularProgress percentage={percentage} color={color} size={110} />
            </div>
        </div>
    );
}
