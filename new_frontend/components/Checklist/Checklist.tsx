"use client";

import { useState } from "react";

type ChecklistProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Checklist({
  options,
  selected,
  onChange,
  placeholder,
  disabled = false,
}: ChecklistProps) {
  const toggle = (value: string) => {
    if (disabled) return;
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      className={`bg-surface p-4 border border-line rounded-card ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <h2 className="font-semibold mb-3 text-ink text-sm">{placeholder}</h2>
      <ul className="space-y-2.5">
        {options.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id={item}
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 accent-brand cursor-pointer disabled:cursor-not-allowed"
            />
            <label
              htmlFor={item}
              className={`text-sm text-ink-secondary leading-snug ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
