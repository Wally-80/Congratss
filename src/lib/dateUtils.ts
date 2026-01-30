/**
 * Calculates the days remaining until the next occurrence of a date (e.g., birthday),
 * or until a specific future date.
 * Also returns a progress percentage.
 */
export function calculateCountdown(dateString: string, createdAtString?: string) {
    const targetDate = new Date(dateString);
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    let finalTargetUTC: number;
    let isRecurring = false;

    // If the target year is in the future, treat it as a specific one-time event
    if (targetDate.getUTCFullYear() > now.getFullYear()) {
        finalTargetUTC = Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate());
    } else {
        // Treat as recurring (birthday/anniversary)
        isRecurring = true;
        finalTargetUTC = Date.UTC(now.getFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate());
        if (finalTargetUTC < todayUTC) {
            finalTargetUTC = Date.UTC(now.getFullYear() + 1, targetDate.getUTCMonth(), targetDate.getUTCDate());
        }
    }

    const diffTime = finalTargetUTC - todayUTC;
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Percentage Calculation
    let percentage = 0;
    if (isRecurring) {
        // Progress through 365 days
        percentage = Math.round(((365 - daysLeft) / 365) * 100);
    } else if (createdAtString) {
        // Progress from creation to target
        const createdAt = new Date(createdAtString);
        const startUTC = Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
        const totalDuration = finalTargetUTC - startUTC;
        const elapsed = todayUTC - startUTC;
        if (totalDuration > 0) {
            percentage = Math.round((elapsed / totalDuration) * 100);
        }
    }

    return {
        daysLeft,
        percentage: Math.max(0, Math.min(100, percentage)),
        formattedDate: targetDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: !isRecurring ? 'numeric' : undefined,
            timeZone: 'UTC'
        })
    };
}
