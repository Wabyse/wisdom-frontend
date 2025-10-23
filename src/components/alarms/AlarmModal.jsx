import React, { useState } from "react";
import { useAlarms } from "../../context/AlarmContext";
import { DAYS } from "../../constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

export default function AlarmModal({ userId }) {
  const { alarms, addAlarm, toggleAlarm, removeAlarm } = useAlarms();
  const [open, setOpen] = useState(false);

  // form state
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState("");
  const [days, setDays] = useState([]);
  const [oneTime, setOneTime] = useState(false);

  const toggleDay = (d) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || !time) return alert("Label and time are required");

    addAlarm({
      userId,
      label,
      time,
      date: date || null,
      days: days.length ? days : [],
      oneTime,
      active: true,
    });

    setLabel("");
    setDate("");
    setDays([]);
    setOneTime(false);
  };

  // Filter alarms for this user
  const userAlarms = alarms.filter((a) => a.userId === userId);

  return (
    <div>
      {/* trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
      >
        <FontAwesomeIcon icon={faBell} className="text-xl text-gray-500" />
      </button>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-lg text-gray-800 dark:text-gray-100 relative">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              My Alarms
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </h2>

            {/* create form */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-5">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Alarm label"
                className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900"
                required
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900"
                  required
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={oneTime}
                    onChange={(e) => setOneTime(e.target.checked)}
                  />
                  One-time
                </label>

                <div className="flex flex-wrap gap-1 text-xs">
                  {DAYS.map((day, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`px-2 py-1 rounded-full border ${
                        days.includes(i)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-900"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Alarm
                </button>
              </div>
            </form>

            {/* list section */}
            {userAlarms.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No alarms yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {userAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-lg p-2 text-sm"
                  >
                    <div>
                      <div className="font-medium">{alarm.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {alarm.date
                          ? `${alarm.date} at ${alarm.time}`
                          : alarm.days?.length
                          ? `Every ${alarm.days
                              .map((d) => DAYS[d])
                              .join(", ")} at ${alarm.time}`
                          : `At ${alarm.time}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAlarm(alarm.id)}
                        title={alarm.active ? "Turn off" : "Turn on"}
                      >
                        <FontAwesomeIcon
                          icon={alarm.active ? faToggleOn : faToggleOff}
                          className={`text-xl ${
                            alarm.active ? "text-green-500" : "text-gray-400"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => removeAlarm(alarm.id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}