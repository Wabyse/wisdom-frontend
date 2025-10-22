import React, { createContext, useContext, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { createAlarm } from "./AlarmTypes";

const AlarmContext = createContext(null);

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = (data) => {
    const newAlarm = createAlarm({ ...data, id: uuidv4() });
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const updateAlarm = (id, updates) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const removeAlarm = (id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const value = useMemo(
    () => ({
      alarms,
      addAlarm,
      updateAlarm,
      toggleAlarm,
      removeAlarm,
    }),
    [alarms]
  );

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
}

// Custom hook for easy use
export function useAlarms() {
  const context = useContext(AlarmContext);
  if (!context)
    throw new Error("useAlarms must be used inside an AlarmProvider");
  return context;
}