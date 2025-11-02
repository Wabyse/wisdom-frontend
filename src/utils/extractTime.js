export const extractTime = (date) => {
  if (!date) return "";
  const cleanDate = date.trim();

  let timePart = cleanDate.includes("T")
    ? cleanDate.split("T")[1]
    : cleanDate.split(" ")[1] || "";

  timePart = timePart.split(".")[0].split("+")[0];

  return timePart.slice(0, 5);
};