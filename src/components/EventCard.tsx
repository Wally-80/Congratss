import React from 'react';
import { Gift, Heart, Clock, MoreHorizontal } from 'lucide-react';

interface EventCardProps {
    name: string;
    type: 'birthday' | 'anniversary' | 'retirement';
    date: string;
    daysLeft: number;
    progress?: number;
    highlight?: 'pink' | 'blue' | 'purple';
}

export function EventCard({ name, type, date, daysLeft, progress, highlight = 'pink' }: EventCardProps) {
    const Icon = type === 'birthday' ? Gift : type === 'anniversary' ? Heart : Clock;

    const neonClass = highlight === 'pink' ? 'neon-glow-pink' : highlight === 'blue' ? 'neon-glow-blue' : '';
    const textColor = highlight === 'pink' ? 'text-pink-500' : highlight === 'blue' ? 'text-blue-500' : 'text-purple-500';
    const bgColor = highlight === 'pink' ? 'bg-pink-500/10' : highlight === 'blue' ? 'bg-blue-500/10' : 'bg-purple-500/10';

    return (
        <div className={`glass group relative overflow-hidden rounded-3xl p-6 transition-all hover:scale-[1.02] ${neonClass}`}>
            {/* Decorative Blob */}
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${bgColor} blur-3xl transition-all group-hover:opacity-80`} />

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className={`flex items-center gap-2 ${textColor}`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{type}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight">{name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs font-medium">{date}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bgColor} ${textColor} relative`}>
                        {progress !== undefined && (
                            <svg className="absolute inset-0 h-full w-full -rotate-90">
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={150}
                                    strokeDashoffset={150 - (150 * progress) / 100}
                                    className="opacity-20"
                                />
                            </svg>
                        )}
                        <span className="text-lg font-black tracking-tighter">{daysLeft}d</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex -space-x-1.5">
                    <div className="h-7 w-7 rounded-full border-2 border-[#18181b] bg-zinc-800" />
                    <div className="h-7 w-7 rounded-full border-2 border-[#18181b] bg-zinc-700" />
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
