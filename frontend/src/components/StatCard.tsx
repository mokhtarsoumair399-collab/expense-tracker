import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  tone: "mint" | "coral" | "amber" | "steel";
  icon: LucideIcon;
  helper?: string;
};

const toneClasses = {
  mint: "bg-mint/10 text-mint",
  coral: "bg-coral/10 text-coral",
  amber: "bg-amber/10 text-amber",
  steel: "bg-steel/10 text-steel"
};

export const StatCard = ({ title, value, helper, tone, icon: Icon }: StatCardProps) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="label">{title}</p>
        <p className="mt-2 text-2xl font-bold text-ink dark:text-white">{value}</p>
        {helper ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
      </div>
      <span className={`rounded-md p-2 ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </section>
);
