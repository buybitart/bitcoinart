import React, { useEffect, useState } from "react";
import { differenceInSeconds, intervalToDuration } from "date-fns";

export default function Duration({ className, endTime }) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    differenceInSeconds(new Date(endTime), new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = differenceInSeconds(new Date(endTime), new Date());
      setRemainingSeconds(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <time dateTime={`PT${remainingSeconds}S`} className={className}>
      {remainingSeconds <= 0 ? "Ended" : formatRemainingTime(remainingSeconds)}
    </time>
  );
}

function formatRemainingTime(seconds) {
  const duration = intervalToDuration({ start: new Date(), end: new Date(Date.now() + seconds * 1000) });

  if (duration.months > 0) return `${duration.months} month${duration.months > 1 ? "s" : ""}`;
  if (duration.days > 0) return `${duration.days} day${duration.days > 1 ? "s" : ""}`;
  if (duration.hours > 0) return `${duration.hours} hour${duration.hours > 1 ? "s" : ""}`;
  if (duration.minutes > 0) return `${duration.minutes} minute${duration.minutes > 1 ? "s" : ""}`;
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}