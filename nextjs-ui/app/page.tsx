"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useTheme } from "./components/ThemeProvider";

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const room = formData.get("room") as string;
    if (room.trim() !== "") {
      router.push(`/room/${room}`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>

      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Seph's Glass Bead Games Timer</h1>
        <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          For playing <a href="https://glassbeadgames.com/" className="text-blue-500 hover:underline">The Glass Bead Game</a>
        </h2>
      </header>

      <main className="flex flex-col md:flex-row gap-8 justify-center items-start mb-12">
        <div className="flex-1 max-w-md">
          <Link
            href="/room/_random"
            className="block w-full p-6 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg font-semibold transition-colors duration-200 shadow-md"
          >
            Host a new room
          </Link>
        </div>

        <div className="flex-1 max-w-md">
          <form onSubmit={handleJoin} className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <label className="block mb-4">
              <span className="text-sm font-medium">Join room by name:</span>
              <input
                type="text"
                id="room"
                name="room"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-label="Room name"
              />
            </label>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition-colors duration-200"
            >
              Go
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Room will be created if it does not exist
            </p>
          </form>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-600 dark:text-gray-400">
        This timer is maintained as a gift to the community. Contribute in turn
        by submitting issues and bug fixes{" "}
        <a href="https://github.com/josephg/glassbeadtimer" className="text-blue-500 hover:underline">on Github</a>
      </footer>
    </div>
  );
}
