"use client";

import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6">
        {children}
      </div>

      <div className="hidden md:flex w-1/2 bg-[#1e1b4b] text-white items-center justify-center">
        <div className="text-center px-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/task-img.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
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
