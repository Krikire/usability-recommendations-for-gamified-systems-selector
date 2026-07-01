"use client";

import { useState } from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="flex gap-1 border-b border-line">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px cursor-pointer transition ${
              idx === activeIndex
                ? "border-brand text-brand"
                : "border-transparent text-ink-tertiary hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 p-4 border border-line rounded-card bg-surface shadow-sm">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
}
