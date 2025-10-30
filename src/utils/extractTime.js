export const extractTime = (date) => {
    if (!date) return "";
    const cleanDate = date.trim();
    let timePart = cleanDate.includes("T")
        ? cleanDate.split("T")[1]
        : cleanDate.split(" ")[1] || "";
    return timePart.split(".")[0].split("+")[0];
};