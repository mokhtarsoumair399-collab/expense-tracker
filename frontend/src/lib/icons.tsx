import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconName = keyof typeof Icons;

export const DynamicIcon = ({ name, className }: { name?: string; className?: string }) => {
  const Icon = ((name && Icons[name as IconName]) || Icons.CircleDollarSign) as LucideIcon;
  return <Icon className={className} aria-hidden="true" />;
};
