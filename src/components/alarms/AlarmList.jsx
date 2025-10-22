import React from "react";
import { useAlarms } from "./AlarmContext";
import { DAYS } from "../../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

export default function AlarmList({ userId }) {
  const { alarms, toggleAlarm, removeAlarm } = useAlarms();

  // filter alarms by user
  const userAlarms = alarms.filter((a) => a.userId === userId);

  if (userAlarms.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-300 text-sm mt-4">
        No alarms yet.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {userAlarms.map((alarm) => (
        <div
          key={alarm.id}
          className="flex items-center justify-between bg-white dark:bg-gray-800 border rounded-xl shadow-sm px-4 py-3"
        >
          <div>
            <div className="font-medium text-gray-800 dark:text-white">{alarm.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {alarm.date
                ? `${alarm.date} at ${alarm.time}`
                : alarm.days?.length
                ? `Every ${alarm.days.map((d) => DAYS[d]).join(", ")} at ${alarm.time}`
                : `At ${alarm.time}`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAlarm(alarm.id)}
              className="hover:scale-110 transition-transform"
              title={alarm.active ? "Turn off" : "Turn on"}
            >
              <FontAwesomeIcon
                icon={alarm.active ? faToggleOn : faToggleOff}
                className={`text-2xl ${
                  alarm.active ? "text-green-500" : "text-gray-400"
                }`}
              />
            </button>

            <button
              onClick={() => removeAlarm(alarm.id)}
              className="hover:scale-110 transition-transform text-red-500"
              title="Delete alarm"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}