"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function SwitchUser() {
  const [selectedUser, setSelectedUser] = useState<string>("Institution");
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const users = ["Revou", "Udemy", "Coursera"];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (activeOption === null) return;

    if (e.key === "ArrowDown") {
      setActiveOption((prev) => (prev === users.length - 1 ? 0 : prev! + 1));
    } else if (e.key === "ArrowUp") {
      setActiveOption((prev) => (prev === 0 ? users.length - 1 : prev! - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      setSelectedUser(users[activeOption]);
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {selectedUser || "Select User"}
            {/* Down arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <div
            className="space-y-2"
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {users.map((user, index) => (
              <p
                key={user}
                role="menuitem"
                tabIndex={0}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm transition-colors ${
                  activeOption === index
                    ? "bg-slate-200 text-black"
                    : "hover:bg-slate-100"
                } ${selectedUser === user ? "font-semibold" : ""}`}
                onMouseEnter={() => setActiveOption(index)}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </p>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
