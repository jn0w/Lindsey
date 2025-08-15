"use client";

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";

// Added HeartFrameIcon definition
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

// Icon for submit button
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M7.504 3.004h5.002a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5H7.504a1.5 1.5 0 01-1.5-1.5V4.504a1.5 1.5 0 011.5-1.5zM9.004 3.004a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-2zM12.504 10.504a.5.5 0 00-.5-.5h-4a.5.5 0 000 1h4a.5.5 0 00.5-.5zm0 2a.5.5 0 00-.5-.5h-4a.5.5 0 000 1h4a.5.5 0 00.5-.5z" />
  </svg>
);

// Predefined lovey dovey tags
const PREDEFINED_TAGS = [
  "💕 Date Night",
  "🎂 Special Day",
  "🌅 Adventure",
  "💑 Together",
  "🏠 Home",
  "🎉 Celebration",
  "💝 Surprise",
  "🌸 Spring",
  "☀️ Summer",
  "🍂 Autumn",
  "❄️ Winter",
  "✈️ Travel",
  "🍽️ Food",
  "🎵 Music",
  "📷 Photos",
  "💌 Love Note",
  "🌙 Evening",
  "🍿 Movie Night",
  "💭 Lovey-Dovey Memory",
  "🤪 Goofy Lindsey and Jakub",
];

export default function MemoryForm({ onMemoryAdded, existingMemory = null }) {
  const [title, setTitle] = useState(existingMemory?.title || "");
  const [description, setDescription] = useState(
    existingMemory?.description || ""
  );
  const [date, setDate] = useState(
    existingMemory?.date
      ? new Date(existingMemory.date).toISOString().split("T")[0]
      : ""
  );
  const [previewUrl, setPreviewUrl] = useState(existingMemory?.imageUrl || "");
  const [tags, setTags] = useState(existingMemory?.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError("");

    // Create a preview URL from the file
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPreviewUrl(reader.result?.toString() || "");

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };
      img.src = reader.result?.toString() || "";
    });
    reader.readAsDataURL(file);
  };

  // Get dimensions of existing memory image on component mount
  useEffect(() => {
    if (existingMemory?.imageUrl) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };
      img.src = existingMemory.imageUrl;
    }
  }, [existingMemory?.imageUrl]);

  // Handle tag selection/deselection
  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle custom tag creation
  const addCustomTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setCustomTag("");
      setShowCustomTagInput(false);
    }
  };

  // Handle custom tag input keypress
  const handleCustomTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    } else if (e.key === "Escape") {
      setCustomTag("");
      setShowCustomTagInput(false);
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      if (!description.trim()) {
        throw new Error("Description is required");
      }
      if (!previewUrl) {
        throw new Error("Image is required");
      }

      // Prepare memory data
      const memoryData = {
        title,
        description,
        date: date || new Date().toISOString(),
        imageUrl: previewUrl,
        tags,
      };

      // Check if we're editing an existing memory
      if (existingMemory) {
        // For editing, call the parent's callback directly (it will handle the PUT request)
        setSuccess("Memory updated successfully!");

        // Notify parent component immediately for editing
        if (onMemoryAdded && typeof onMemoryAdded === "function") {
          onMemoryAdded(memoryData);
        }
      } else {
        // For creating new memory, send data to API
        const response = await fetch("/api/memories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memoryData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add memory");
        }

        // Show success message and reset form
        setSuccess("Memory added successfully!");
        resetForm();

        // Notify parent component after a short delay to allow user to see success message
        setTimeout(() => {
          if (onMemoryAdded && typeof onMemoryAdded === "function") {
            onMemoryAdded(data.data);
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setPreviewUrl("");
    setTags([]);
    setCustomTag("");
    setShowCustomTagInput(false);
    setImageDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="relative max-w-2xl mx-auto p-3 sm:p-4 bg-gradient-to-br from-pink-200/70 via-pink-100/50 to-purple-200/60 dark:from-pink-800/50 dark:via-pink-900/40 dark:to-purple-800/50 border-2 border-pink-300 dark:border-pink-500 rounded-xl shadow-lg">
      <HeartFrameIcon
        sizeClass="w-8 h-8"
        className="absolute top-0 right-0 text-pink-500 dark:text-pink-400 transform translate-x-1/3 -translate-y-1/3 rotate-[20deg] z-20"
      />
      <HeartFrameIcon
        sizeClass="w-6 h-6"
        className="absolute bottom-0 left-0 text-pink-400 dark:text-pink-500 transform -translate-x-1/3 translate-y-1/3 rotate-[-15deg] z-20"
      />
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-inner overflow-hidden p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-pink-700 dark:text-pink-500 text-center">
          ✨ {existingMemory ? "Edit Your Memory" : "Add New Memory"} ✨
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100/80 border border-red-300 text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100/80 border border-green-300 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this memory"
              className="mt-1 block w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-pink-500/90 dark:text-pink-400/80">
              Leave blank for today's date.
            </p>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-3">
              💖 Tags (choose what makes this memory special)
            </label>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="mb-3 p-3 bg-pink-50/70 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <p className="text-xs text-pink-600 dark:text-pink-400 mb-2 font-medium">
                  Selected tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-pink-200 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Predefined Tags */}
            <div className="mb-4">
              <p className="text-xs text-pink-600 dark:text-pink-400 mb-2 font-medium">
                Choose from our lovely collection:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PREDEFINED_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                      tags.includes(tag)
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md transform scale-105"
                        : "bg-pink-100/80 hover:bg-pink-200/90 dark:bg-pink-800/40 dark:hover:bg-pink-700/60 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center gap-2">
              {!showCustomTagInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomTagInput(true)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-sm transition-all duration-200"
                >
                  <PlusIcon />
                  Create Custom Tag
                </button>
              ) : (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={handleCustomTagKeyPress}
                    placeholder="Type your custom tag..."
                    className="flex-1 px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-full shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-xs placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    disabled={!customTag.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full text-xs font-medium shadow-sm transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTag("");
                      setShowCustomTagInput(false);
                    }}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs font-medium shadow-sm transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-pink-500/90 dark:text-pink-400/80">
              ✨ Tags help you organize and find your special memories later!
            </p>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-pink-600 dark:text-pink-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-700 file:text-purple-700 dark:file:text-purple-100 hover:file:bg-purple-200 dark:hover:file:bg-purple-600 cursor-pointer"
            />
            <p className="mt-1 text-xs text-pink-500/90 dark:text-pink-400/80">
              Your image will be displayed in its original proportions.
            </p>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-pink-700 dark:text-pink-400 mb-1">
                Image Preview:
              </p>
              <div
                className="mx-auto rounded-md overflow-hidden border-2 border-pink-300 dark:border-pink-500 shadow-sm"
                style={{ maxWidth: "100%" }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this special memory..."
              className="mt-1 block w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>

          <div className="mt-8 pt-6 border-t border-pink-200 dark:border-pink-700/50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setError("");
                setSuccess("");
                if (existingMemory) {
                  setTitle(existingMemory.title);
                  setDescription(existingMemory.description);
                  setDate(
                    existingMemory.date
                      ? new Date(existingMemory.date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  );
                  setPreviewUrl(existingMemory.imageUrl);
                  setTags(existingMemory.tags || []);
                  // Get dimensions of existing memory image
                  const img = new window.Image();
                  img.onload = () => {
                    setImageDimensions({
                      width: img.width,
                      height: img.height,
                    });
                  };
                  img.src = existingMemory.imageUrl;
                }
              }}
              className="px-5 py-2.5 border border-pink-400 dark:border-pink-600 rounded-full shadow-sm text-sm font-medium text-pink-700 dark:text-pink-400 bg-white/80 hover:bg-pink-50/90 dark:bg-gray-700/60 dark:hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors w-full sm:w-auto"
            >
              {existingMemory ? "Reset Changes" : "Clear Form"}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 flex items-center justify-center w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </>
              ) : (
                <>
                  {existingMemory ? <SaveIcon /> : <PlusIcon />}
                  {existingMemory ? "Save Changes" : "Add Memory"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
