"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type MultiSelectDropdownProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const NOT_APPLICABLE = "Not applicable";
  const defaultOptions = [
    { label: NOT_APPLICABLE, value: NOT_APPLICABLE },
    ...options,
  ];
  const isNotApplicableSelected = selected.includes(NOT_APPLICABLE);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection logic for Not Applicable
  const toggleOption = (value: string) => {
    if (value === NOT_APPLICABLE) {
      if (isNotApplicableSelected) {
        onChange(selected.filter((v) => v !== NOT_APPLICABLE));
      } else {
        onChange([NOT_APPLICABLE]);
      }
    } else {
      if (isNotApplicableSelected) {
        // If Not Applicable is selected, remove it and add the new value
        onChange([value]);
      } else {
        // Toggle the selected value
        if (selected.includes(value)) {
          const newSelected = selected.filter((v) => v !== value);
          // If no other values are selected, add Not Applicable back
          if (newSelected.length === 0) {
            onChange([NOT_APPLICABLE]);
          } else {
            onChange(newSelected);
          }
        } else {
          onChange([...selected, value]);
        }
      }
    }
  };

  const renderRow = (value: string, label: string) => {
    const isSelected = selected.includes(value);
    return (
      <div
        key={value}
        onClick={() => toggleOption(value)}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-[10px] cursor-pointer transition-colors ${
          isSelected
            ? "bg-brand-subtle text-brand-onsubtle font-medium"
            : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
        }`}
      >
        <span>{label}</span>
        {isSelected && (
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink pl-0.5">
        {placeholder}
      </label>
      <div className="relative w-full" ref={dropdownRef}>
        <div
          className={`flex flex-wrap items-center gap-1.5 bg-surface-muted border rounded-input px-2.5 py-2 cursor-pointer min-h-[44px] transition-colors ${
            isOpen ? "border-brand ring-2 ring-brand/30" : "border-line"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 && (
            <span className="text-ink-muted text-sm px-1">{placeholder}</span>
          )}
          {selected.map((value) => {
            const option = defaultOptions.find((opt) => opt.value === value);
            const isNA = value === NOT_APPLICABLE;
            return (
              <span
                key={value}
                className={`px-2 py-0.5 text-sm rounded-md flex items-center gap-1 ${
                  isNA
                    ? "bg-surface text-ink-tertiary border border-line"
                    : "bg-brand-subtle text-brand-onsubtle"
                }`}
              >
                {option?.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(value);
                  }}
                  className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  &times;
                </button>
              </span>
            );
          })}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            className={`ml-auto h-4 w-4 text-ink-tertiary transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="m6 8 4 4 4-4"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-20 mt-1.5 w-full bg-surface border border-line rounded-pop shadow-pop max-h-60 overflow-auto p-1 flex flex-col gap-0.5">
            {renderRow(NOT_APPLICABLE, NOT_APPLICABLE)}
            {options.map((option) => renderRow(option.value, option.label))}
          </div>
        )}
      </div>
    </div>
  );
}
