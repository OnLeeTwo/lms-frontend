"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function SwitchUser() {
  const [selectedUser, setSelectedUser] = useState<string | null>("Institution");

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedUser || "Select User"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <p onClick={() => setSelectedUser("Revou")}>Revou</p>
            <p onClick={() => setSelectedUser("Udemy")}>Udemy</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}