"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings2, X, Coffee, Target } from "lucide-react";

const PomodoroTimer = ({ onClose }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (isBreak) {
              setMinutes(focusMinutes);
              setIsBreak(false);
            } else {
              setMinutes(breakMinutes);
              setIsBreak(true);
              setCompletedSessions(prev => prev + 1);
            }
            new Audio('data:audio/mp3;base64,').play().catch(e => console.log('Audio play failed'));
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, focusMinutes, breakMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setMinutes(breakMinutes);
    } else {
      setMinutes(focusMinutes);
    }
    setSeconds(0);
  };
  
  const saveSettings = (e) => {
    e.preventDefault();
    setMinutes(focusMinutes);
    setSeconds(0);
    setIsActive(false);
    setIsBreak(false);
    setShowSettings(false);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const progress = isBreak 
    ? ((breakMinutes * 60 - (minutes * 60 + seconds)) / (breakMinutes * 60)) * 100
    : ((focusMinutes * 60 - (minutes * 60 + seconds)) / (focusMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl w-full max-w-md border border-border animate-scale-in-smooth">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isBreak ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
              {isBreak ? <Coffee className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isBreak ? "Break Time" : "Focus Time"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Session {completedSessions + 1} • {completedSessions} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl hover:bg-muted transition-all duration-200 group"
              aria-label="Settings"
            >
              <Settings2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-muted transition-all duration-200 group"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <form onSubmit={saveSettings} className="mb-6 p-4 bg-muted rounded-2xl space-y-4 animate-slide-in-right">
            <div className="flex items-center justify-between">
              <label htmlFor="focus-time" className="font-medium text-foreground">
                Focus Duration
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="focus-time"
                  type="number"
                  value={focusMinutes}
                  onChange={(e) => setFocusMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 text-center rounded-lg bg-background border-2 border-border focus:border-primary transition-colors duration-200 outline-none"
                  min="1"
                  max="60"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="break-time" className="font-medium text-foreground">
                Break Duration
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="break-time"
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 text-center rounded-lg bg-background border-2 border-border focus:border-primary transition-colors duration-200 outline-none"
                  min="1"
                  max="30"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-2.5">
              Apply Settings
            </button>
          </form>
        )}

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  isBreak ? 'text-green-500' : 'text-primary'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-6xl font-bold font-mono text-foreground">
                {formatTime(minutes)}:{formatTime(seconds)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`btn-primary px-6 py-3 flex items-center gap-2 ${
              isActive ? 'bg-destructive hover:bg-destructive/90' : ''
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="btn-secondary px-6 py-3 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;