export const extractDate = (date) => {
    if (!date) return "";
    const cleanDate = date.trim();
    return cleanDate.includes("T")
        ? cleanDate.split("T")[0]
        : cleanDate.split(" ")[0];
};