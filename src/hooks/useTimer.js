import { useEffect, useMemo, useState } from 'react';

export const useTimer = (serverEntry) => {
  const [activeTimer, setActiveTimer] = useState(serverEntry || null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setActiveTimer(serverEntry || null);
  }, [serverEntry]);

  useEffect(() => {
    if (!activeTimer?.isActive) {
      return undefined;
    }

    setNow(Date.now());
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeTimer]);

  const elapsedSeconds = useMemo(() => {
    if (!activeTimer?.startAt) {
      return 0;
    }

    const startedAt = new Date(activeTimer.startAt).getTime();
    return Math.max(0, Math.floor((now - startedAt) / 1000));
  }, [activeTimer, now]);

  const start = (entry) => {
    setActiveTimer(entry);
  };

  const stop = (entry = null) => {
    setActiveTimer(entry);
  };

  const isRunning = Boolean(activeTimer?.isActive);

  return { activeTimer, elapsedSeconds, isRunning, start, stop };
};
