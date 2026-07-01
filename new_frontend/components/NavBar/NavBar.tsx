import React from "react";
const Navbar = () => {
  return (
    <nav className="w-full bg-surface/80 backdrop-blur-sm border-b border-line sticky top-0 z-30 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        <span className="text-base font-bold tracking-tight text-ink">
          Gamification recommendations determination
        </span>
      </div>
      <div className="flex gap-6">
        <a
          href="/"
          className="text-sm text-ink-secondary hover:text-brand transition font-medium"
        >
          Home
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
