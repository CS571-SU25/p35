/* Minimal radial gauge with SVG — replace later with d3 or your favorite lib */
interface Props {
    score: number; // 0–1
}

export function PerfGauge({ score }: Props) {
    const pct = Math.round(score * 100);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = circumference * (1 - score);

    return (
        <svg width={100} height={100} className="block">
            <circle
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
                stroke="#e4e4e7"
                fill="none"
            />
            <circle
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
                stroke="hsl(var(--primary))"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
            />
            <text
                x="50"
                y="55"
                className="text-sm font-bold fill-foreground"
                textAnchor="middle"
            >
                {pct}%
            </text>
        </svg>
    );
}
