import { Gift, Calendar, Heart } from "lucide-react";
import CircularProgress from "./CircularProgress";

interface CelebrationCardProps {
    title: string;
    daysLeft: number;
    date: string;
    percentage: number;
    type: "birthday" | "anniversary";
}

export default function CelebrationCard({ title, daysLeft, date, percentage, type }: CelebrationCardProps) {
    const isBirthday = type === "birthday";
    const color = isBirthday ? "pink" : "cyan";
    const Icon = isBirthday ? Gift : Heart;

    return (
        <div className="glass-card flex items-center justify-between mb-4">
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
