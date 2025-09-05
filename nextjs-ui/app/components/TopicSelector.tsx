'use client';

import { useState } from 'react';

const SIMPLE_TOPICS = ['Focus', 'Reflect', 'Create', 'Rest'];

export default function TopicSelector({ onStart }: { onStart: (selectedTopics: string[], duration: number) => void }) {
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(60);
  const [selectAll, setSelectAll] = useState(false);

  const toggleTopic = (topicName: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicName)) {
      newSelected.delete(topicName);
    } else {
      newSelected.add(topicName);
    }
    setSelectedTopics(newSelected);
    setSelectAll(newSelected.size === SIMPLE_TOPICS.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTopics(new Set());
      setSelectAll(false);
    } else {
      setSelectedTopics(new Set(SIMPLE_TOPICS));
      setSelectAll(true);
    }
  };

  const handleStart = () => {
    const selectedTopicNames = Array.from(selectedTopics);
    if (selectedTopicNames.length > 0) {
      onStart(selectedTopicNames, duration);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Select Topics for Glass Bead Timer</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Duration per topic (seconds):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="1"
            className="ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Duration per topic in seconds"
          />
        </label>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={toggleSelectAll}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            selectAll
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          aria-label={selectAll ? 'Deselect all topics' : 'Select all topics'}
        >
          {selectAll ? 'Deselect All' : 'Select All'}
        </button>
        <span className="text-lg">Selected: {selectedTopics.size} topics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {SIMPLE_TOPICS.map((topic) => (
          <div
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`p-4 rounded-lg text-center cursor-pointer transition-all duration-200 border-2 ${
              selectedTopics.has(topic)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTopic(topic);
              }
            }}
            aria-label={`Toggle selection for ${topic} topic`}
            aria-pressed={selectedTopics.has(topic)}
          >
            <h3 className="text-sm md:text-base font-medium">{topic}</h3>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleStart}
          disabled={selectedTopics.size === 0}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 ${
            selectedTopics.size > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Start timer with selected topics"
        >
          Start Timer
        </button>
      </div>
    </div>
  );
}