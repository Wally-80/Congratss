/**
 * Calculates days until the next yearly occurrence of a date.
 * All events recur annually by month/day until deleted.
 */
export function calculateCountdown(dateString: string) {
    const targetDate = new Date(dateString);
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
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
        formattedDate: targetDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        })
    };
}
