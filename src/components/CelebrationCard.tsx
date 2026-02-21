import { Gift, Calendar, Heart, Trash2, Pencil, PartyPopper, Star, Send } from "lucide-react";
import CircularProgress from "./CircularProgress";

interface CelebrationCardProps {
    id: string;
    title: string;
    daysLeft: number;
    date: string;
    rawDate: string;
    percentage: number;
    type: "birthday" | "anniversary" | "retirement" | "other";
    onDelete?: (id: string) => void;
    onEdit?: (data: any) => void;
    onSendGreeting?: (data: any) => void;
}

export default function CelebrationCard({ id, title, daysLeft, date, rawDate, percentage, type, onDelete, onEdit, onSendGreeting }: CelebrationCardProps) {
    const getCelebrationDetails = () => {
        switch (type) {
            case "birthday":
                return {
                    icon: Gift,
                    color: "pink",
                    neonColor: "text-neon-pink",
                    message: daysLeft === 0 ? "Happy Birthday!" : `${daysLeft} days until your birthday`
                };
            case "anniversary":
                return {
                    icon: Heart,
                    color: "cyan",
                    neonColor: "text-neon-cyan",
                    message: daysLeft === 0 ? "Happy Anniversary!" : `${daysLeft} days until your anniversary`
                };
            case "retirement":
                return {
                    icon: PartyPopper,
                    color: "purple",
                    neonColor: "text-purple-400",
                    message: daysLeft === 0 ? "Happy Retirement!" : `${daysLeft} days until freedom (Retirement)`
                };
            default:
                return {
                    icon: Star,
                    color: "white",
                    neonColor: "text-white",
                    message: `${daysLeft} days left`
                };
        }
    };

    const { icon: Icon, color, neonColor, message } = getCelebrationDetails() as {
        icon: any;
        color: "pink" | "cyan" | "purple" | "white";
        neonColor: string;
        message: string;
    };


    return (
        <div className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 relative group overflow-hidden p-4 sm:p-4">
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-10">
                {onSendGreeting && (
                    <button
                        onClick={() => onSendGreeting({ title, type })}
                        className="p-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-200 hover:bg-cyan-500/40 transition-all"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={() => onEdit({ id, title, rawDate, type })}
                        className="p-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/20 transition-all"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(id)}
                        className="p-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-red-200 hover:bg-red-500/40 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-lg font-semibold text-white/90">{title}</h3>
                    <Icon className={`w-4 h-4 ${neonColor}`} />
                </div>
                <p className="text-sm font-medium text-white/70 mb-2">{message}</p>
                <div className="flex items-center gap-1.5 text-white/40">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs uppercase tracking-wider">{date}</span>
                </div>
            </div>

            <div className="self-end sm:self-auto sm:ml-4 mt-2 sm:mt-0">
                <CircularProgress percentage={percentage} color={color} size={85} />
            </div>
        </div>
    );
}

