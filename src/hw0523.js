import React, { useState, useRef, useEffect } from "react";
import "./hw0523.css";

const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  const startTimer = () => {
    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    setTimeLeft(totalSeconds);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  };

  const setTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setMinutes(0);
    setSeconds(0);
    setTimeLeft(0);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    let formattedMins = mins.toString();
    let formattedSecs = secs.toString();

    if (mins < 10) {
      formattedMins = "0" + mins;
    }
    if (secs < 10) {
      formattedSecs = "0" + secs;
    }

    return `${formattedMins}:${formattedSecs}`;
  };

  return (
    <div className="timer-container">
      <h1>Timer</h1>
      <div>
        <input
          type="number"
          value={minutes}
          onChange={(e) => {
            if (e.target.value === "" || parseInt(e.target.value) < 0)
              setMinutes("0");
            else setMinutes(e.target.value);
          }}
          disabled={isRunning}
        />
        Minutes
        <input
          type="number"
          value={seconds}
          onChange={(e) => {
            if (e.target.value === "" || parseInt(e.target.value) < 0)
              setSeconds("0");
            else setSeconds(e.target.value);
          }}
          disabled={isRunning}
        />
        Seconds
        <button onClick={startTimer} disabled={isRunning || timeLeft > 0}>
          START
        </button>
      </div>
      <div>
        <button onClick={setTimer}>PAUSE/RESUME</button>
        <button onClick={resetTimer}>RESET</button>
      </div>
      <h2>{formatTime(timeLeft)}</h2>
    </div>
  );
};

export default Timer;
