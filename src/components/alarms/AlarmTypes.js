export const createAlarm = ({
    id,
    label,
    time,
    date = null,     // if specific date
    days = [],        // e.g. [1,3,5] for Mon,Wed,Fri
    oneTime = false,
    active = true,
    triggered = false
}) => ({
    id,
    label,
    time,
    date,
    days,
    oneTime,
    active,
    triggered
});

// Helper for formatting times (e.g. 7 -> "07")
export const pad = (n) => String(n).padStart(2, "0");