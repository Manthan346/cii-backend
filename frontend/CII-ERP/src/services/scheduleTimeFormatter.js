function parseClockParts(value) {
  if (value == null || value === "") return null;

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) {
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return { hours, minutes };
    }
  }

  const [hStr, mStr] = text.split(":");
  const hours = Number(hStr);
  const minutes = Number(mStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return { hours, minutes };
}

export function formatSessionTime(value) {
  const clock = parseClockParts(value);

  if (!clock) {
    return { time: "—", period: "" };
  }

  const period = clock.hours >= 12 ? "PM" : "AM";
  let hours = clock.hours % 12;
  if (hours === 0) hours = 12;
  const minutes = String(clock.minutes).padStart(2, "0");

  return { time: `${hours}:${minutes}`, period };
}
