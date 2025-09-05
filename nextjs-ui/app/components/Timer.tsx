'use client';

import { useState, useEffect, useRef } from 'react';

const SIMPLE_TOPICS = ['Focus', 'Reflect', 'Create', 'Rest'];

interface TimerProps {
  selectedTopics?: string[];
  duration?: number;
}

export default function Timer({ selectedTopics, duration = 60 }: TimerProps) {
  const audioHi = useRef<HTMLAudioElement | null>(null);
  const audioLo = useRef<HTMLAudioElement | null>(null);
  const audioSilence = useRef<HTMLAudioElement | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const [topics] = useState(selectedTopics || SIMPLE_TOPICS);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [overallTime, setOverallTime] = useState(0);
  const [hasPlayedEndTone, setHasPlayedEndTone] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [newDurationInput, setNewDurationInput] = useState(duration.toString());

  // Preload audio files
  useEffect(() => {
    if (!audioHi.current) {
      audioHi.current = new Audio('/hi-metal-tone.mp3');
      audioLo.current = new Audio('/lo-metal-tone.mp3');
      audioSilence.current = new Audio('/silence.mp3');
      // Play silence to unlock autoplay
      audioSilence.current?.play().catch(console.error);
    }
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isPaused) {
      intervalId.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next topic
            setCurrentTopicIndex((idx) => (idx + 1) % topics.length);
            setHasPlayedEndTone(false);
            return currentDuration;
          }
          const newTime = prev - 1;
          if (newTime === 10 && !hasPlayedEndTone) {
            audioLo.current?.play().catch(console.error);
            setHasPlayedEndTone(true);
          }
          return newTime;
        });
        setOverallTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isPaused, topics.length, currentDuration, hasPlayedEndTone]);

  useEffect(() => {
    if (!isPaused) {
      audioHi.current?.play().catch(console.error);
    }
  }, [currentTopicIndex, isPaused]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const reset = () => {
    setCurrentTopicIndex(0);
    setTimeRemaining(currentDuration);
    setOverallTime(0);
    setHasPlayedEndTone(false);
    setIsPaused(false);
  };
  const adjustDuration = () => {
    const newDur = parseInt(newDurationInput);
    if (newDur > 0) {
      setCurrentDuration(newDur);
      setTimeRemaining(Math.min(timeRemaining, newDur));
    }
  };

  const currentTopic = topics[currentTopicIndex];

  return (
    <div className="text-center p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Glass Bead Timer</h1>
      <div className="text-6xl md:text-8xl font-mono font-bold mb-6 text-blue-600 dark:text-blue-400">
        {timeRemaining}
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">{currentTopic}</h2>
      <div className="text-lg mb-6">Overall Time: {Math.floor(overallTime / 60)}:{(overallTime % 60).toString().padStart(2, '0')}</div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button
          onClick={isPaused ? resume : pause}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
          aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Adjust Duration per Topic (seconds):
          <input
            type="number"
            value={newDurationInput}
            onChange={(e) => setNewDurationInput(e.target.value)}
            min="1"
            className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Duration per topic in seconds"
          />
          <button
            onClick={adjustDuration}
            className="ml-2 px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors duration-200"
            aria-label="Apply new duration"
          >
            Apply
          </button>
        </label>
      </div>
    </div>
  );
}