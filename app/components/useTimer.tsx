import { useState, useEffect } from "react";

export const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((sec) => sec += 1);

        if (seconds === 60) {
            setSeconds(0);
            setMinutes((minutes) => minutes += 1);
        }

        if (minutes === 60) {
            setMinutes(0);
            setHours(hours => hours += 1)
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {}, [seconds]);

  return { seconds, minutes, hours, isRunning, setIsRunning };
};