export const normalDate = (date) => {
    if (!date) return "";

    const formattedDate = new Date(date).toLocaleString("en-GB", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return formattedDate;
};