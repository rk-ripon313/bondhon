"use client";

import { CalendarPlus, Droplet, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BloodRequestModal from "../blood-request/BloodRequestModal";

export default function CreateAction() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [bloodRequestModalOpen, setBloodRequestModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    setIsPinned((prev) => !prev);
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsPinned(false);
  };

  const handleBloodRequestClick = () => {
    closeMenu();
    setBloodRequestModalOpen(true);
  };

  const handleCreateEventClick = () => {
    closeMenu();
    // TODO: Event Modal or Navigation
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity duration-200 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Create Action */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed right-6 bottom-8 z-50 flex flex-col items-end"
      >
        {/* Action Buttons */}
        <div
          className={`mb-3 flex flex-col items-end gap-2.5 origin-bottom-right transition-all duration-250 ${
            isOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0"
          }`}
        >
          {/* Create Blood Request */}
          <button
            type="button"
            onClick={handleBloodRequestClick}
            className={`group flex items-center gap-3 rounded-full border border-border/60 bg-app-card/95 px-4 py-2.5 text-sm font-medium text-app-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-95 ${
              isOpen
                ? "translate-y-0 opacity-100 cursor-pointer"
                : "translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? "40ms" : "0ms",
            }}
          >
            <span className="text-xs font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-app-foreground">
              Create Blood Request
            </span>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 transition-all duration-200 group-hover:bg-rose-500 group-hover:text-white">
              <Droplet className="size-4" />
            </span>
          </button>

          {/* Create Event */}
          <button
            type="button"
            onClick={handleCreateEventClick}
            className={`group flex items-center gap-3 rounded-full border border-border/60 bg-app-card/95 px-4 py-2.5 text-sm font-medium text-app-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-95 ${
              isOpen
                ? "translate-y-0 opacity-100 cursor-pointer"
                : "translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? "80ms" : "0ms",
            }}
          >
            <span className="text-xs font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-app-foreground">
              Create Event
            </span>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-all duration-200 group-hover:bg-emerald-500 group-hover:text-white">
              <CalendarPlus className="size-4" />
            </span>
          </button>
        </div>

        {/* Main FAB */}
        <button
          type="button"
          aria-label={isOpen ? "Close creation menu" : "Open creation menu"}
          aria-expanded={isOpen}
          onClick={handleToggle}
          className={`flex size-12 items-center justify-center rounded-full bg-app-primary text-white shadow-xl ring-4 ring-app-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOpen ? "rotate-45 shadow-2xl ring-app-primary/10" : "rotate-0"
          }`}
        >
          <Plus className="size-6" />
        </button>
      </div>

      {/* Blood Request Modal */}
      <BloodRequestModal
        open={bloodRequestModalOpen}
        onOpenChange={setBloodRequestModalOpen}
      />
    </>
  );
}
