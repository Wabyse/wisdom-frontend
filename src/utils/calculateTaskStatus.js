export const calculateTaskStatus = (data) => {
    if (new Date(data.end_date) < new Date() && data.assignee_status !== 100 && data.reviewer_status > 0 && data.manager_status > 0) {
        return "متاخر - لم يتم التسليم - الملف غير مكتمل - تم التقييم"
    } else if (new Date(data.end_date) < new Date() && data.assignee_status !== 100 && ((data.reviewer_status > 0 && data.manager_status === 0) || (data.reviewer_status === 0 && data.manager_status > 0))) {
        return "متاخر - لم يتم التسليم - الملف غير مكتمل - تقييم جزئي"
    } else if (new Date(data.end_date) < new Date() && data.assignee_status !== 100 && data.reviewer_status === 0 && data.manager_status === 0) {
        return "متاخر - لم يتم التسليم - الملف غير مكتمل - غير مقييم"
    } else if (new Date(data.end_date) > new Date() && (data.assignee_status !== 100) && data.reviewer_status > 0 && data.manager_status > 0) {
        return "قيد التنفيذ - الملف غير مكتمل - تم التقييم"
    } else if (new Date(data.end_date) > new Date() && (data.assignee_status !== 100) && ((data.reviewer_status > 0 && data.manager_status === 0) || (data.reviewer_status === 0 && data.manager_status > 0))) {
        return "قيد التنفيذ - الملف غير مكتمل - تقييم جزئي"
    } else if (new Date(data.end_date) > new Date() && (data.assignee_status !== 100) && data.reviewer_status === 0 && data.manager_status === 0) {
        return "قيد التنفيذ - الملف غير مكتمل - غير مقييم"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && data.reviewer_status > 0 && data.manager_status > 0) {
        return "متاخر - لم يتم التسليم - الملف مكتمل - تم التقييم"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && ((data.reviewer_status > 0 && data.manager_status === 0) || (data.reviewer_status === 0 && data.manager_status > 0))) {
        return "متاخر - لم يتم التسليم - الملف مكتمل - تقييم جزئي"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && data.reviewer_status === 0 && data.manager_status === 0) {
        return "متاخر - لم يتم التسليم - الملف مكتمل - غير مقييم"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && data.reviewer_status > 0 && data.manager_status > 0) {
        return "تم التسليم - في الميعاد - الملف مكتمل - تم التقييم"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && ((data.reviewer_status > 0 && data.manager_status === 0) || (data.reviewer_status === 0 && data.manager_status > 0))) {
        return "تم التسليم - في الميعاد - الملف مكتمل - تقييم جزئي"
    } else if (new Date(data.end_date) < new Date() && (data.assignee_status === 100) && data.reviewer_status === 0 && data.manager_status === 0) {
        return "تم التسليم - في الميعاد - الملف مكتمل - غير مقييم"
    }
}