export const calculateTaskStatus = (data) => {
    if (new Date(data.end_date) < new Date() && (data.status !== "submitted" && data.status !== "finished")) {
        return "متاخر - لم يتم التسليم - الملف غير مكتمل"
    } else if (new Date(data.end_date) > new Date() && (data.status !== "submitted" || data.status !== "finished")) {
        return "قيد التنفيذ - الملف غير مكتمل"
    } else if (new Date(data.end_date) < new Date() && (data.status === "submitted")) {
        return "متاخر - لم يتم التسليم - الملف مكتمل"
    } else if (new Date(data.end_date) < new Date() && (data.status === "finished")) {
        return "تم التسليم - في الميعاد - الملف مكتمل"
    }
}