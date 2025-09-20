"use client";

import { useState } from "react";

export default function RestaurantsForm({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      if (!name.trim()) {
        throw new Error("Restaurant name is required");
      }
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add restaurant");
      }
      setSuccess("Restaurant added!");
      reset();
      if (onCreated) onCreated(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4 bg-gradient-to-br from-pink-200/70 via-pink-100/50 to-purple-200/60 dark:from-pink-800/50 dark:via-pink-900/40 dark:to-purple-800/50 border-2 border-pink-300 dark:border-pink-500 rounded-xl shadow-lg">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-inner overflow-hidden p-5">
        <h3 className="text-xl font-bold mb-4 text-pink-700 dark:text-pink-500 text-center">
          Add Restaurant
        </h3>

        {error && (
          <div className="mb-3 p-3 bg-red-100/80 border border-red-300 text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 p-3 bg-green-100/80 border border-green-300 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Restaurant Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-pink-700 dark:text-pink-400 mb-1"
            >
              Short Description (what we ate, did we like it?)
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-pink-50/80 dark:bg-gray-700/60 border border-pink-300 dark:border-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setError("");
                setSuccess("");
              }}
              className="px-5 py-2.5 border border-pink-400 dark:border-pink-600 rounded-full shadow-sm text-sm font-medium text-pink-700 dark:text-pink-400 bg-white/80 hover:bg-pink-50/90 dark:bg-gray-700/60 dark:hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "Add Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
