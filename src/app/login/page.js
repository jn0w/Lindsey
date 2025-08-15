"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDateChange = (e) => {
    const value = e.target.value;

    // Remove non-numeric characters
    const numbersOnly = value.replace(/[^\d]/g, "");

    // Format as DD/MM
    if (numbersOnly.length <= 2) {
      setDate(numbersOnly);
    } else if (numbersOnly.length <= 4) {
      const day = numbersOnly.substring(0, 2);
      const month = numbersOnly.substring(2);
      setDate(`${day}/${month}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Extract day and month from the formatted date
      const [day, month] = date.split("/");

      if (!day || !month) {
        setError("Please enter a valid date in DD/MM format");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ day, month }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to home page
        router.push("/");
      } else {
        // Login failed
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background (Kept for login page distinction if desired, or can be removed if global gradient is preferred) */}
      {/* <div className="absolute inset-0 w-full h-full z-0 animated-gradient"></div> */}

      {/* Login form container with frosted glass effect */}
      <div className="relative z-10 max-w-md w-full mx-4 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="#f472b6"
              className="animate-pulse"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-pink-600">
            Memories of Lindsey and Jakub
          </h1>
          <p className="mt-2 text-gray-600">
            Please enter our anniversary date to unlock our memories my love
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Our Anniversary Date (DD/MM)
            </label>
            <input
              id="date"
              name="date"
              type="text"
              required
              value={date}
              onChange={handleDateChange}
              className="appearance-none block w-full px-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-black"
              placeholder="DD/MM"
              maxLength="5"
              autoComplete="off"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || date.length < 4}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
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
                  Unlocking Memories...
                </span>
              ) : (
                "Unlock Our Memories"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
