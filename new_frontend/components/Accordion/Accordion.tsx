"use client";

import { useState } from "react";

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

export default function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface border border-line rounded-card shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex gap-4 cursor-pointer justify-between items-center p-4 text-left text-[15px] font-semibold text-ink hover:bg-surface-muted transition-colors ${
          isOpen ? "bg-surface-muted" : "bg-surface"
        }`}
      >
        {title}
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-onsubtle text-lg leading-none transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div className="p-4 text-sm flex flex-col gap-4 text-ink-secondary border-t border-line">
          {children}
        </div>
      )}
    </div>
  );
}
