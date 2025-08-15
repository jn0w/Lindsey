"use client";

import { useState } from "react";
import Image from "next/image";
import MemoryGallery from "./components/MemoryGallery";
import MemoryForm from "./components/MemoryForm";
import Navbar from "./components/Navbar";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle memory added event
  const handleMemoryAdded = () => {
    // Hide the form
    setShowForm(false);
    // Trigger gallery refresh
    setRefreshGallery((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 relative z-10 flex-grow">
        {!showForm ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-pink-700 dark:text-pink-500 flex items-center">
                <span className="mr-2">❤️</span>
                Our Special Moments
                <span className="ml-2">❤️</span>
              </h2>
              <button
                onClick={toggleForm}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Memory
                </span>
              </button>
            </div>
            <MemoryGallery key={refreshGallery} />
          </>
        ) : (
          <div>
            <div className="mb-4">
              <button
                onClick={toggleForm}
                className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Gallery
              </button>
            </div>
            <MemoryForm onMemoryAdded={handleMemoryAdded} />
          </div>
        )}
      </main>

      <footer className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-t border-pink-200 dark:border-pink-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-pink-700 dark:text-pink-500 text-sm flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="#ec4899"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Our Memories - A place to treasure our special moments together
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 24 24"
              fill="#ec4899"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </p>
        </div>
      </footer>
    </div>
  );
}
