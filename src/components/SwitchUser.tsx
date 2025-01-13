"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Role {
  institute_id: number; // Add institute_id to Role
  institute_name: string;
  role: string;
}

interface SwitchUserProps {
  roles: Role[];
  onInstituteChange: (instituteId: number) => void; // Add the onInstituteChange function prop
}

export default function SwitchUser({
  roles,
  onInstituteChange,
}: SwitchUserProps) {
  const [selectedRole, setSelectedRole] = useState<string>(
    roles[0]?.institute_name || "Select Role"
  );
  const [activeOption, setActiveOption] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (activeOption === null) return;

    if (e.key === "ArrowDown") {
      setActiveOption((prev) => (prev === roles.length - 1 ? 0 : prev! + 1));
    } else if (e.key === "ArrowUp") {
      setActiveOption((prev) => (prev === 0 ? roles.length - 1 : prev! - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      const selectedRole = roles[activeOption!];
      setSelectedRole(selectedRole.institute_name);
      onInstituteChange(selectedRole.institute_id); // Pass institute_id to the parent
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
            {selectedRole}
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
            {roles.map((role, index) => (
              <p
                key={role.institute_name}
                role="menuitem"
                tabIndex={0}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm transition-colors ${
                  activeOption === index
                    ? "bg-slate-200 text-black"
                    : "hover:bg-slate-100"
                } ${
                  selectedRole === role.institute_name ? "font-semibold" : ""
                }`}
                onMouseEnter={() => setActiveOption(index)}
                onClick={() => {
                  setSelectedRole(role.institute_name);
                  onInstituteChange(role.institute_id); // Pass institute_id to the parent
                }}
              >
                {role.institute_name} ({role.role})
              </p>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
