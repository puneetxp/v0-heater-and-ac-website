"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptionalFieldsToggleProps {
  allFields: string[];
  visibleFields: string[];
  onToggle: (field: string) => void;
  title?: string;
}

export function OptionalFieldsToggle({
  allFields,
  visibleFields,
  onToggle,
  title = "Show Optional Fields",
}: OptionalFieldsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const optionalFields = allFields.filter(
    (field) => !["id", "name", "title", "description", "status"].includes(field),
  );

  if (optionalFields.length === 0) return null;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 w-full justify-between"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-slate-50">
          {optionalFields.map((field) => (
            <label
              key={field}
              className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded"
            >
              <input
                type="checkbox"
                checked={visibleFields.includes(field)}
                onChange={() => onToggle(field)}
                className="rounded"
              />
              <span className="text-sm capitalize">{field.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
