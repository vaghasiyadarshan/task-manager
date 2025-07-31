"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Dynamic Content */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6">
        {children}
      </div>

      {/* Right Static Section - hidden on mobile, visible on laptop/desktop */}
      <div className="hidden md:flex w-1/2 bg-[#1e1b4b] text-white items-center justify-center">
        <div className="text-center px-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-lg text-2xl">📊</div>
          </div>
          <h2 className="text-3xl font-bold">Task Manager</h2>
          <p className="mt-2 text-sm opacity-70 leading-6">
            Grow you project smoothly
          </p>
        </div>
      </div>
    </div>
  );
}
