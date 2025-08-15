"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MemoryOfTheDay() {
  const [memoryOfTheDay, setMemoryOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemoryOfTheDay();
  }, []);

  const fetchMemoryOfTheDay = async () => {
    try {
      console.log("🔄 Fetching memory of the day...");
      const response = await fetch("/api/memory-of-the-day");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        console.error(
          "❌ Response not OK:",
          response.status,
          response.statusText
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 API Response data:", data);
      setMemoryOfTheDay(data.memoryOfTheDay);
    } catch (error) {
      console.error("💥 Error fetching memory of the day:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-pink-600">
            Finding today's special memory...
          </span>
        </div>
      </div>
    );
  }

  if (!memoryOfTheDay) {
    return (
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 mb-8 shadow-lg border-2 border-pink-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-700 mb-2">
            💕 Memory of the Day 💕
          </h2>
          <p className="text-pink-600">
            No memories yet! Add your first memory to start creating beautiful
            daily reminders ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 rounded-3xl p-6 mb-8 shadow-xl border-2 border-pink-200 relative overflow-hidden">
      {/* Floating hearts animation - both sides */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side hearts */}
        <div className="absolute top-3 left-6 text-pink-400 animate-bounce text-2xl">
          💕
        </div>
        <div className="absolute top-16 left-4 text-purple-300 animate-pulse delay-500 text-lg">
          💖
        </div>
        <div className="absolute bottom-20 left-8 text-pink-300 animate-bounce delay-1000 text-xl">
          ✨
        </div>
        <div className="absolute bottom-8 left-3 text-purple-400 animate-pulse delay-300 text-lg">
          💝
        </div>

        {/* Right side hearts */}
        <div className="absolute top-2 right-4 text-pink-300 animate-pulse text-xl">
          💖
        </div>
        <div className="absolute top-12 right-8 text-purple-300 animate-bounce delay-700 text-2xl">
          💕
        </div>
        <div className="absolute bottom-16 right-6 text-pink-400 animate-pulse delay-1000 text-lg">
          ✨
        </div>
        <div className="absolute bottom-4 right-3 text-purple-200 animate-bounce delay-500 text-xl">
          💝
        </div>

        {/* Extra sparkles */}
        <div className="absolute top-8 left-1/3 text-yellow-300 animate-ping delay-200 text-sm">
          ⭐
        </div>
        <div className="absolute bottom-12 right-1/3 text-yellow-400 animate-ping delay-800 text-sm">
          ⭐
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl">💟</span>
            <span className="text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
              Memory of the Day
            </span>
            <span className="text-4xl">💟</span>
          </h2>
          <p className="text-sm text-pink-500 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Link href={`/memories/${memoryOfTheDay._id}`} className="block">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              {memoryOfTheDay.imageUrl && (
                <div className="md:w-1/3">
                  <img
                    src={memoryOfTheDay.imageUrl}
                    alt={memoryOfTheDay.title}
                    className="w-full h-48 md:h-32 object-cover rounded-xl shadow-md border-2 border-pink-100 group-hover:border-pink-300 transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div
                className={`${
                  memoryOfTheDay.imageUrl ? "md:w-2/3" : "w-full"
                } flex flex-col justify-center`}
              >
                <h3 className="text-xl font-bold text-pink-700 mb-2 flex items-center group-hover:text-purple-600 transition-colors duration-300">
                  💖 {memoryOfTheDay.title}
                </h3>

                <p className="text-gray-700 mb-2 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {memoryOfTheDay.description}
                </p>

                <div className="flex items-center text-sm text-pink-600 font-medium group-hover:text-purple-600 transition-colors duration-300">
                  <span className="mr-2">📅</span>
                  {new Date(memoryOfTheDay.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Click indicator */}
            <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm text-pink-500 font-medium">
                ✨ Click to view full memory ✨
              </span>
            </div>
          </div>
        </Link>

        <div className="text-center mt-4">
          <p className="text-sm text-pink-500 italic">
            "Every day is a chance to remember how beautiful our love story
            truly is" 💕
          </p>
        </div>
      </div>
    </div>
  );
}
