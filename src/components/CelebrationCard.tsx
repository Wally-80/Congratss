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
        <div className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 relative overflow-hidden p-4 sm:p-4 active:scale-[0.98] transition-transform">
            <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
                        <Icon className={`w-4 h-4 ${neonColor}`} />
                    </div>
                    {/* Action buttons - subtle and clean */}
                    <div className="flex gap-1">
                        {onSendGreeting && (
                            <button
                                onClick={() => onSendGreeting({ title, type })}
                                className="p-2 text-white/40 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
                                title="Share"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => onEdit({ id, title, rawDate, type })}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(id)}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm font-medium text-white/70 mb-2">{message}</p>
                        <div className="flex items-center gap-1.5 text-white/30">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold">{date}</span>
                        </div>
                    </div>
                    <div className="sm:ml-4">
                        <CircularProgress percentage={percentage} color={color} size={80} />
                    </div>
                </div>
            </div>
        </div>
    );
}

