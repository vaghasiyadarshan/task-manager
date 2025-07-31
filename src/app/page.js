"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 gap-8 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Task Manager
        </h1>
        <p className="text-gray-600 text-lg max-w-md">
          Organize, prioritize, and conquer your tasks with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {[
          {
            icon: "✅",
            title: "Simple",
            desc: "Intuitive interface",
          },
          {
            icon: "⚡",
            title: "Fast",
            desc: "Quick task management",
          },
          {
            icon: "🔒",
            title: "Secure",
            desc: "Your data is protected",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h3 className="font-medium text-gray-800">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Login
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
        >
          Create Account
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-8">
        Join thousands of productive users today
      </p>
    </div>
  );
}
