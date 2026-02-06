import React, { useState, useRef, useEffect } from "react";
import "./CountdownTimer.css";

const CountdownTimer = () => {
  const [minutesInput, setMinutesInput] = useState(5);
  const [timeLeft, setTimeLeft] = useState(minutesInput * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const radius = 96;
  const stroke = 14;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Запуск таймера
  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Сброс таймера
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    const total = minutesInput * 60;
    setTimeLeft(total);
    setOffset(circumference);
  };

  // Изменение минут
  const increment = () => setMinutesInput((prev) => Math.min(prev + 1, 99));
  const decrement = () => setMinutesInput((prev) => Math.max(prev - 1, 0));

  // Обновление прогресса круга
  useEffect(() => {
    const total = minutesInput * 60;
    const progress = total === 0 ? 0 : timeLeft / total;
    setOffset(circumference * (1 - progress));
  }, [timeLeft, minutesInput]);

  // Если меняем минуты без запуска таймера
  useEffect(() => {
    if (!isRunning) {
      const total = minutesInput * 60;
      setTimeLeft(total);
      setOffset(circumference);
    }
  }, [minutesInput, isRunning]);

  return (
    <div className={`timer-container ${isRunning ? "running" : ""}`}>
      <h1 className="fade-in">Таймер обратного отсчета</h1>

      <div className="minute-input fade-in">
        <button onClick={decrement} disabled={isRunning}>-</button>
        <span>{minutesInput} мин</span>
        <button onClick={increment} disabled={isRunning}>+</button>
      </div>

      <div className={`timer-circle fade-in ${timeLeft === 0 ? "finished" : ""}`}>
        <svg height={220} width={220}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          <circle
            stroke="#e6ebf2"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={110}
            cy={110}
          />

          <circle
            className="progress"
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={110}
            cy={110}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <div className="timer-time">{formatTime(timeLeft)}</div>
        <div className={`spinner ${isRunning ? "active" : ""}`}></div>
      </div>

      <div className="timer-buttons fade-in">
        <button
          className="start-button"
          onClick={startTimer}
          disabled={isRunning}
        >
          Старт
        </button>
        <button onClick={resetTimer}>Сброс</button>
      </div>
    </div>
  );
};

export default CountdownTimer;
