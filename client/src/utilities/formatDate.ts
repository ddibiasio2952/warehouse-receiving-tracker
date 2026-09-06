// Fix date discrepancy from UTC
export function formatDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC"
    }).format(new Date(date));
}