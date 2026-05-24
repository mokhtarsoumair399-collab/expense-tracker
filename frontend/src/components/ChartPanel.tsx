import type { ReactNode } from "react";

export const ChartPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
    <h2 className="text-base font-semibold text-ink dark:text-white">{title}</h2>
    <div className="mt-4 h-72">{children}</div>
  </section>
);
