function isMarketOpen(exchange: string, now: Date): boolean | null {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);

    const getPart = (type: string) => parts.find((part) => part.type === type)?.value;
    const weekday = getPart("weekday");
    const hour = Number(getPart("hour"));
    const minute = Number(getPart("minute"));

    if (!weekday || Number.isNaN(hour) || Number.isNaN(minute)) return null;

    const time = hour * 60 + minute;

    if (exchange === "US Stocks") {
        return (
            ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday) &&
            time >= 9 * 60 + 30 &&
            time < 16 * 60
        );
    }

    if (exchange === "Forex") {
        if (weekday === "Sun") return time >= 17 * 60;
        if (weekday === "Fri") return time < 17 * 60;
        return ["Mon", "Tue", "Wed", "Thu"].includes(weekday);
    }

    return null;
}

export {
    isMarketOpen
}