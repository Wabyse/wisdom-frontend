import { useEffect } from "react";
import { useAlarms } from "../context/AlarmContext"; // adjust the path if different
import { pad } from "../components/alarms/AlarmTypes"; // adjust path too

export default function useAlarmWatcher(userId, onTrigger) {
  const { alarms, updateAlarm } = useAlarms();

  useEffect(() => {
    if (!userId) return;

    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const currentDate = now.toISOString().split("T")[0];
      const currentDay = now.getDay(); // 0=Sun,1=Mon,...

      alarms.forEach((alarm) => {
        if (!alarm.active || alarm.triggered || alarm.userId !== userId) return;

        const isTimeMatch = alarm.time === currentTime;
        const isDateMatch = alarm.date
          ? alarm.date === currentDate
          : alarm.days?.includes(currentDay);

        if (isTimeMatch && isDateMatch) {
          // ⏰ trigger callback
          if (onTrigger) onTrigger(alarm);
          else console.log("⏰ Alarm triggered:", alarm.label);

          // Mark one-time alarms as triggered
          if (alarm.oneTime) updateAlarm(alarm.id, { triggered: true });
        }
      });
    };

    // Run immediately once on mount
    checkAlarms();

    // Check every minute
    const interval = setInterval(checkAlarms, 60 * 1000);
    return () => clearInterval(interval);
  }, [alarms, userId]);
}