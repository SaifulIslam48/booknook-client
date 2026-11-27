"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Kind = "success" | "error" | "info";
interface Item {
  id: number;
  kind: Kind;
  text: string;
}

const ToastContext = createContext<((kind: Kind, text: string) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const show = useCallback((kind: Kind, text: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, kind, text }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast toast-top toast-end toast-bottom z-[100] max-w-sm">
        {items.map((i) => (
          <div
            key={i.id}
            role="status"
            className={`alert toast-in shadow-lg ${
              i.kind === "success" ? "alert-success" : i.kind === "error" ? "alert-error" : "alert-info"
            }`}
          >
            <span className="text-sm font-medium">{i.text}</span>
            <button
              aria-label="Dismiss"
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside ToastProvider");
  return useMemo(
    () => ({
      success: (text: string) => show("success", text),
      error: (text: string) => show("error", text),
      info: (text: string) => show("info", text),
    }),
    [show]
  );
}
