export const cairoDate = (date) => {
        const cairo = new Date(date).toLocaleString("en-GB", {
            timeZone: "Africa/Cairo",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
        return cairo;
};