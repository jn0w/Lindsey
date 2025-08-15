"use client";

import { useState } from "react";

export default function DbTest() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/mongodb");
      const data = await response.json();

      if (data.success) {
        setStatus("Connected successfully to MongoDB Atlas!");
      } else {
        setError(`Connection failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">MongoDB Connection Test</h2>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test MongoDB Connection"}
      </button>

      {status && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}
    </div>
  );
}
