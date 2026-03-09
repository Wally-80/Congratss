export type CelebrationRecurrence = "annual" | "one_time";

/**
 * Calculates countdown metadata for annual celebrations and one-time events.
 */
export function calculateCountdown(dateString: string, recurrence: CelebrationRecurrence = "annual") {
    const targetDate = new Date(dateString);
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    if (recurrence === "one_time") {
        const targetUTC = Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate());
        const diffTime = targetUTC - todayUTC;
        const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const isPast = daysLeft < 0;

        return {
            daysLeft,
            percentage: isPast ? 100 : 0,
            formattedDate: targetDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC"
            }),
            isPast,
        };
    }

    let finalTargetUTC = Date.UTC(now.getFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate());
    if (finalTargetUTC < todayUTC) {
        finalTargetUTC = Date.UTC(now.getFullYear() + 1, targetDate.getUTCMonth(), targetDate.getUTCDate());
    }

    const diffTime = finalTargetUTC - todayUTC;
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Progress through the current annual cycle (handles leap years).
    const cycleDays = Math.max(
        1,
        Math.round((Date.UTC(now.getFullYear() + 1, now.getMonth(), now.getDate()) - todayUTC) / (1000 * 60 * 60 * 24))
    );
    const percentage = Math.round(((cycleDays - daysLeft) / cycleDays) * 100);

    return {
        daysLeft,
        percentage: Math.max(0, Math.min(100, percentage)),
        formattedDate: targetDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC"
        }),
        isPast: false,
    };
}
