export function tmsDevliverSituation(startDate, endDate, statusPercent, submitDate) {
    startDate = startDate ? new Date(startDate) : null;
    endDate = endDate ? new Date(endDate) : null;
    submitDate = submitDate ? new Date(submitDate) : null;

    const today = new Date();

    // If no start date, return empty
    if (!startDate) {
        return "";
    }

    // If no submit date (not delivered yet)
    if (!submitDate) {
        if (statusPercent < 100) {
            if (endDate < today) {
                return "موعد التنفيذ - متأخر - لم يتم التسليم - الهدف غير مكتمل";
            } else {
                return "موعد التنفيذ - لم يتم التسليم - الهدف غير مكتمل";
            }
        }
    }

    // Delivered before the end date
    if (submitDate < endDate) {
        if (statusPercent < 100) {
            return "أتم التسليم - قبل الموعد - الهدف غير مكتمل";
        } else {
            return "أتم التسليم - قبل الموعد - الهدف مكتمل";
        }
    }

    // Delivered exactly on the end date
    if (submitDate.getTime() === endDate.getTime()) {
        if (statusPercent < 100) {
            return "أتم التسليم - في الموعد - الهدف غير مكتمل";
        } else {
            return "أتم التسليم - في الموعد - الهدف مكتمل";
        }
    }

    // Delivered after the end date (late)
    if (submitDate > endDate) {
        if (statusPercent < 100) {
            return "أتم التسليم - متأخر - الهدف غير مكتمل";
        } else {
            return "تحقق من البيانات";
        }
    }

    return "تحقق من البيانات"; // Fallback
}