"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MemoryForm from "@/app/components/MemoryForm";
import Link from "next/link";
import { use } from "react";

export default function EditMemoryPage({ params }) {
  const [memory, setMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const id = use(params).id;

  // Fetch memory details
  useEffect(() => {
    const fetchMemory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/memories/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch memory");
        }

        setMemory(data.data);
      } catch (err) {
        console.error("Error fetching memory:", err);
        setError("Failed to load memory for editing. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMemory();
    }
  }, [id]);

  // Handle memory update
  const handleMemoryUpdated = async (updatedMemory) => {
    try {
      // Update memory via API
      const response = await fetch(`/api/memories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMemory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update memory");
      }

      // Redirect to memory detail page
      router.push(`/memories/${id}`);
    } catch (err) {
      console.error("Error updating memory:", err);
      setError(`Failed to update memory: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-pink-600 dark:text-pink-300">
            Loading memory for editing...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <Link
          href={`/memories/${id}`}
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
          Back to Memory
        </Link>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="max-w-2xl mx-auto my-8 text-center p-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md border border-pink-200 dark:border-pink-800">
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
    <div className="max-w-2xl mx-auto my-8">
      <div className="mb-6">
        <Link
          href={`/memories/${id}`}
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
          Back to Memory
        </Link>
      </div>

      <MemoryForm existingMemory={memory} onMemoryAdded={handleMemoryUpdated} />
    </div>
  );
}
