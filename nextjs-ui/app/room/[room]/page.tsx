'use client';

import { useState } from 'react';
import Timer from '../../components/Timer';
import TopicSelector from '../../components/TopicSelector';

export default function Room() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleStart = (topics: string[], topicDuration: number) => {
    setSelectedTopics(topics);
    setDuration(topicDuration);
    setSetupComplete(true);
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen p-4">
        <Timer selectedTopics={selectedTopics} duration={duration} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <TopicSelector onStart={handleStart} />
    </div>
  );
}