export const padTimePart = (value) => String(value).padStart(2, '0');

export const todayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${padTimePart(now.getMonth() + 1)}-${padTimePart(now.getDate())}`;
};

export const currentTime = () => {
  const now = new Date();
  return `${padTimePart(now.getHours())}:${padTimePart(now.getMinutes())}`;
};

export const combineDateAndTimeToIso = (date, time) => {
  const [year, month, day] = String(date).split('-').map(Number);
  const [hours, minutes] = String(time || '00:00').split(':').map(Number);
  const localDate = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0);
  return localDate.toISOString();
};

export const splitIsoToLocalParts = (isoString) => {
  if (!isoString) {
    return {
      date: todayDate(),
      time: currentTime(),
    };
  }

  const date = new Date(isoString);

  return {
    date: `${date.getFullYear()}-${padTimePart(date.getMonth() + 1)}-${padTimePart(date.getDate())}`,
    time: `${padTimePart(date.getHours())}:${padTimePart(date.getMinutes())}`,
  };
};
