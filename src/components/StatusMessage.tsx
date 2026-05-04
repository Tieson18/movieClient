import type { ReactNode } from "react";

type StatusKind = "error" | "success" | "info";

interface StatusMessageProps {
  kind: StatusKind;
  children: ReactNode;
}

export function StatusMessage({ kind, children }: StatusMessageProps) {
  const toneByKind: Record<StatusKind, string> = {
    error: "border border-rose-500/30 bg-rose-500/10 text-rose-200",
    success: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    info: "border border-sky-500/30 bg-sky-500/10 text-sky-200",
  };

  return <div className={`rounded-xl px-4 py-3 text-sm ${toneByKind[kind]}`}>{children}</div>;
}
