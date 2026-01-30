"use client";

interface CircularProgressProps {
    percentage: number;
    color: "pink" | "cyan";
    size?: number;
}

export default function CircularProgress({ percentage, color, size = 100 }: CircularProgressProps) {
    const radius = size * 0.4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const neonColor = color === "pink" ? "var(--color-neon-pink)" : "var(--color-neon-cyan)";
    const glowClass = color === "pink" ? "neon-glow-pink" : "neon-glow-cyan";

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={neonColor}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className={`transition-all duration-1000 ease-out`}
                    style={{
                        filter: `drop-shadow(0 0 8px ${neonColor})`,
                    }}
                />
            </svg>
            <span className="absolute text-xl font-bold text-white">
                {percentage}%
            </span>
        </div>
    );
}
