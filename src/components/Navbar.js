"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loadUserFromStorage } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex-shrink-0 flex items-center text-white text-xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Task Manager
          </div>

          {user && (
            <div className="flex items-center space-x-6 text-white">
              <div className="hidden md:flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium capitalize">
                  {user.name || user.email.split("@")[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 transition"
              >
                <LogoutIcon fontSize="small" />
                Logout
              </button>

              <div className="relative md:hidden">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "white",
                    color: "#1e40af",
                    fontSize: "0.9rem",
                    border: "1px solid #1e40af",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </Avatar>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm border-b border-gray-200">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 gap-2"
                    >
                      <LogoutIcon fontSize="small" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
