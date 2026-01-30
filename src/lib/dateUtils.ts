/**
 * Calculates the days remaining until the next occurrence of a date (e.g., birthday).
 * Also returns a progress percentage through the wait cycle.
 */
export function calculateCountdown(dateString: string) {
    const targetDate = new Date(dateString);
    const now = new Date();

    // Set the target to the current year
    let nextOccurrence = new Date(
        now.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
    );

    // If the date has already passed this year, set it to next year
    if (nextOccurrence < now) {
        nextOccurrence.setFullYear(now.getFullYear() + 1);
    }

    // Calculate days difference
    const diffTime = nextOccurrence.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Percentage calculation (demo: progress through 365 days)
    const percentage = Math.round(((365 - daysLeft) / 365) * 100);

    return {
        daysLeft,
        percentage: Math.max(0, Math.min(100, percentage)),
        formattedDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
}
