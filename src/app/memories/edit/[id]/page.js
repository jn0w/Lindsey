"use client";

import Link from "next/link";
import { use } from "react";

export default function EditMemoryPage({ params }) {
  const id = use(params).id;

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
      <h3 className="text-2xl font-bold text-pink-700 dark:text-pink-500 mb-2">
        Editing Disabled
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Memories are permanent and cannot be edited.
      </p>
      <Link
        href={`/memories/${id}`}
        className="inline-flex items-center text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
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
