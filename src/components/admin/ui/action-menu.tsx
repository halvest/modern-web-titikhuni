"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export const actionMenuItemClass =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none";

export const destructiveActionMenuItemClass = `${actionMenuItemClass} text-rose-600 hover:bg-rose-50 focus:bg-rose-50`;

export function ActionMenu({
  children,
  disabled = false,
  label = "Aksi lainnya",
  loading = false,
}: {
  children: ReactNode;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const placeMenu = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPosition({
      left: Math.max(8, Math.min(window.innerWidth - 200, rect.right - 192)),
      top: rect.bottom + 4,
    });
  };

  useEffect(() => {
    if (!open) return;

    placeMenu();
    const close = (event: MouseEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const closeOnViewportChange = () => setOpen(false);

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const menu = menuRef.current;
    const trigger = triggerRef.current?.getBoundingClientRect();
    if (trigger && position.top + menu.offsetHeight > window.innerHeight - 8) {
      setPosition((current) => ({
        ...current,
        top: Math.max(8, trigger.top - menu.offsetHeight - 4),
      }));
    }
    menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open, position.top]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
    );
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length;
    items[nextIndex].focus();
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={disabled || loading}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
        aria-label={label}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <MoreHorizontal size={18} aria-hidden="true" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            style={position}
            className="fixed z-50 min-w-[192px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
            onClick={() => setOpen(false)}
            onKeyDown={handleMenuKeyDown}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}
