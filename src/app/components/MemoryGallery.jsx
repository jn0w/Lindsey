"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MemoryOfTheDay from "./MemoryOfTheDay";

const HeartFrameIcon = ({
  className = "",
  rotationClass = "",
  sizeClass = "w-4 h-4",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`absolute text-pink-700 dark:text-pink-500 ${sizeClass} ${className} ${rotationClass}`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function MemoryGallery() {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Fetch memories
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/memories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch memories");
      }

      const memoriesData = data.data || [];
      setMemories(memoriesData);
      setFilteredMemories(memoriesData);

      // Extract all unique tags
      const tags = [
        ...new Set(memoriesData.flatMap((memory) => memory.tags || [])),
      ];
      setAllTags(tags.sort());
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError("Failed to load memories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter memories by selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredMemories(memories);
    } else {
      const filtered = memories.filter((memory) =>
        selectedTags.every((tag) => memory.tags?.includes(tag))
      );
      setFilteredMemories(filtered);
    }
  }, [memories, selectedTags]);

  // Toggle tag selection
  const toggleTagFilter = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all tag filters
  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-pink-700 dark:text-pink-300">
            Loading our special moments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
        {error}
        <button
          onClick={fetchMemories}
          className="ml-4 underline text-pink-600 hover:text-pink-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center p-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md border border-pink-200 dark:border-pink-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-pink-400 mb-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <h3 className="text-xl font-medium text-purple-700 dark:text-purple-300">
          No memories yet
        </h3>
        <p className="mt-2 text-pink-600 dark:text-pink-400">
          Add your first memory to start your collection of special moments!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Memory of the Day Section */}
      <MemoryOfTheDay />

      {/* Tag Filter Section */}
      {allTags.length > 0 && (
        <div className="bg-gradient-to-r from-pink-100/80 via-purple-50/60 to-pink-100/80 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-pink-900/30 backdrop-blur-sm rounded-xl p-4 border border-pink-200 dark:border-pink-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-400 flex items-center">
              🏷️ Filter by Tags
            </h3>
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="text-pink-600 dark:text-pink-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
            >
              {showTagFilter ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showTagFilter && (
            <div className="space-y-3">
              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="p-3 bg-pink-50/70 dark:bg-pink-800/20 rounded-lg border border-pink-200 dark:border-pink-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-pink-600 dark:text-pink-400">
                      Active filters:
                    </p>
                    <button
                      onClick={clearTagFilters}
                      className="text-xs text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTagFilter(tag)}
                          className="ml-2 text-pink-200 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Tags */}
              <div>
                <p className="text-xs font-medium text-pink-600 dark:text-pink-400 mb-2">
                  Available tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                          : "bg-pink-100/60 hover:bg-pink-200/80 dark:bg-pink-800/30 dark:hover:bg-pink-700/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <p className="text-xs text-pink-500/80 dark:text-pink-400/70 text-center">
                {filteredMemories.length} of {memories.length} memories
                {selectedTags.length > 0 && " match your filters"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* No filtered results */}
      {filteredMemories.length === 0 && selectedTags.length > 0 && (
        <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md border border-pink-200 dark:border-pink-800">
          <div className="text-4xl mb-3">💔</div>
          <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">
            No memories match your filters
          </h3>
          <p className="text-pink-600 dark:text-pink-400 mb-4">
            Try removing some tags or explore other beautiful moments!
          </p>
          <button
            onClick={clearTagFilters}
            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full text-sm font-medium shadow-sm transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredMemories.map((memory) => {
          return (
            <div
              key={memory._id}
              className="relative p-3 bg-gradient-to-br from-pink-200/70 via-pink-100/50 to-purple-200/60 dark:from-pink-800/50 dark:via-pink-900/40 dark:to-purple-800/50 border-4 border-double border-pink-400 dark:border-pink-600 rounded-xl shadow-lg transform hover:-translate-y-1 group transition-all duration-300"
            >
              <HeartFrameIcon
                sizeClass="w-8 h-8"
                className="absolute top-0 right-0 text-pink-500 dark:text-pink-400 transform translate-x-1/3 -translate-y-1/3 rotate-[20deg] group-hover:scale-110 transition-transform duration-300 z-20"
              />
              <HeartFrameIcon
                sizeClass="w-5 h-5"
                className="absolute bottom-0 left-0 text-pink-400 dark:text-pink-500 transform -translate-x-1/3 translate-y-1/3 rotate-[-15deg] group-hover:scale-105 transition-transform duration-300 z-20"
              />

              <div className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden group-hover:shadow-lg">
                <Link href={`/memories/${memory._id}`}>
                  <div
                    className="cursor-pointer"
                    style={{ height: "240px", overflow: "hidden" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-500/20 group-hover:to-pink-500/30 z-10 transition-opacity duration-300"></div>
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-500 mb-1 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
                    {memory.title}
                  </h3>
                  <time className="text-sm text-pink-600/80 dark:text-pink-400/80 mb-2 block flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formatDate(memory.date)}
                  </time>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
                    {memory.description}
                  </p>

                  {/* Memory Tags */}
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {memory.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-400/80 to-purple-400/80 text-white rounded-full shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                        {memory.tags.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-pink-300/60 dark:bg-pink-700/60 text-pink-700 dark:text-pink-300 rounded-full">
                            +{memory.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/memories/${memory._id}`}
                    className="mt-3 inline-block text-pink-700 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-300 font-medium group-hover:underline flex items-center"
                  >
                    View Memory
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
