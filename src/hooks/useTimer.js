import { useEffect, useState } from 'react';

export const useTimer = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeTimer) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - activeTimer.startedAt) / 1000)),
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeTimer]);

  const start = (draft) => {
    setActiveTimer({ ...draft, startedAt: Date.now() });
    setElapsedSeconds(0);
  };

  const stop = () => {
    if (!activeTimer) return null;

    const finalSeconds = Math.max(
      1,
      Math.floor((Date.now() - activeTimer.startedAt) / 1000),
    );
    const result = { ...activeTimer, durationSeconds: finalSeconds };

    setActiveTimer(null);
    setElapsedSeconds(0);

    return result;
  };

  const isRunning = activeTimer !== null;

  return { activeTimer, elapsedSeconds, isRunning, start, stop };
};
