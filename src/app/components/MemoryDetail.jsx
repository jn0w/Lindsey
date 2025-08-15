"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// New reusable Heart Icon for the frame
const HeartFrameIcon = ({ className = "", sizeClass = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`absolute text-pink-700 dark:text-pink-500 ${sizeClass} ${className}`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function MemoryDetail({ memoryId }) {
  const [memory, setMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch memory details
  useEffect(() => {
    const fetchMemory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/memories/${memoryId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch memory");
        }

        setMemory(data.data);
      } catch (err) {
        console.error("Error fetching memory:", err);
        setError("Failed to load memory. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (memoryId) {
      fetchMemory();
    }
  }, [memoryId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle memory deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this precious memory?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/memories/${memoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete memory");
      }

      // Redirect to home page after deletion
      router.push("/");
    } catch (err) {
      console.error("Error deleting memory:", err);
      setError(`Failed to delete memory: ${err.message}`);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-pink-600 dark:text-pink-300">
            Loading your special moment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="text-center p-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md border border-pink-200 dark:border-pink-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-pink-400 mb-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <h3 className="text-xl font-medium text-pink-700 dark:text-pink-500">
          Memory not found
        </h3>
        <Link
          href="/"
          className="mt-4 inline-block text-pink-700 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-300 font-medium"
        >
          Back to Our Gallery
        </Link>
      </div>
    );
  }

  return (
    // FrameContainer: Thinner border, adjusted padding
    <div className="relative max-w-4xl mx-auto p-6 bg-gradient-to-br from-pink-200/70 via-pink-100/50 to-purple-200/60 dark:from-pink-800/50 dark:via-pink-900/40 dark:to-purple-800/50 border-2 border-pink-300 dark:border-pink-500 rounded-xl shadow-lg">
      {/* Main large heart in top-right corner of the frame - size adjusted */}
      <HeartFrameIcon
        sizeClass="w-8 h-8" // Adjusted size
        className="absolute top-0 right-0 text-pink-500 dark:text-pink-400 transform translate-x-1/3 -translate-y-1/3 rotate-[20deg] z-20"
      />
      {/* Smaller decorative heart in bottom-left corner - size adjusted */}
      <HeartFrameIcon
        sizeClass="w-6 h-6" // Adjusted size
        className="absolute bottom-0 left-0 text-pink-400 dark:text-pink-500 transform -translate-x-1/3 translate-y-1/3 rotate-[-15deg] z-20"
      />

      {/* InnerCard: Adjusted rounding and background */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden relative z-10">
        {/* Image Section - using natural aspect ratio */}
        <div className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-500/20 z-10"></div>
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-auto max-h-[70vh] object-contain z-0"
          />
        </div>

        <div className="p-6 relative text-center">
          {/* Title, Date, Buttons container for flex layout */}
          <div className="flex flex-col items-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-pink-700 dark:text-pink-500 mb-1">
                {memory.title}
              </h1>
              <time className="text-xs text-pink-500/90 dark:text-pink-300/90 block mb-3">
                {formatDate(memory.date)}
              </time>
            </div>

            {/* Description - moved here, above buttons */}
            <div className="mt-1 mb-4 w-full max-w-prose mx-auto">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-base leading-relaxed">
                {memory.description}
              </p>
            </div>

            {/* Tags Display */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="mt-2 mb-4 w-full max-w-prose mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                  {memory.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - centered and styled, made smaller */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full justify-center pt-2">
              <Link
                href={`/memories/edit/${memoryId}`}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
              >
                <span className="flex items-center">
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
