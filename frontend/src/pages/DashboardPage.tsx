import { ArrowRight, CreditCard, TrendingDown, TrendingUp, Wallet, WalletCards } from "lucide-react";
import type { ComponentType } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader } from "../components/Loader";
import { useAsync } from "../hooks/useAsync";
import { DynamicIcon } from "../lib/icons";
import { currency, shortDate } from "../lib/format";
import { api } from "../services/api";
import type { Transaction } from "../types";

const dashboardColors = {
  balance: "#7b49ee",
  income: "#ff5b04",
  expense: "#f52538"
};

const DashboardStat = ({
  title,
  value,
  icon,
  tone
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: "balance" | "income" | "expense";
}) => {
  const Icon = icon;
  const color = dashboardColors[tone];

  return (
    <section className="rounded-lg border border-slate-100 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-8">
        <span
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-white shadow-[0_16px_30px_rgba(15,23,42,0.14)]"
          style={{ backgroundColor: color }}
        >
          <Icon className="h-9 w-9" />
        </span>
        <div>
          <p className="text-xl font-bold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-[#17141d] dark:text-white">{value}</p>
        </div>
      </div>
    </section>
  );
};

const TransactionPill = ({ transaction }: { transaction: Transaction }) => {
  const isIncome = transaction.type === "income";

  return (
    <span
      className={`inline-flex min-w-32 items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-bold ${
        isIncome ? "bg-[#effdf5] text-[#23c87a]" : "bg-[#fff2f3] text-[#dd4f62]"
      }`}
    >
      {isIncome ? "+" : "-"} {currency(transaction.amount)}
      {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
    </span>
  );
};

const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
  if (!transactions.length) {
    return <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No recent transactions.</div>;
  }

  return (
    <div className="grid gap-8">
      {transactions.slice(0, 5).map((transaction) => (
        <article key={transaction._id} className="grid grid-cols-[auto_1fr_auto] items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-[#7c3ff2]">
            <DynamicIcon name={transaction.icon} className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-[#2a2830] dark:text-white">{transaction.category}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{shortDate(transaction.date)}</p>
          </div>
          <TransactionPill transaction={transaction} />
        </article>
      ))}
    </div>
  );
};

const CenterLabel = ({ viewBox, value }: { viewBox?: { cx?: number; cy?: number }; value: number }) => {
  if (!viewBox?.cx || !viewBox?.cy) return null;

  return (
    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={viewBox.cx} dy="-0.45em" className="fill-slate-500 text-lg font-bold">
        Total Balance
      </tspan>
      <tspan x={viewBox.cx} dy="1.55em" className="fill-[#17141d] text-3xl font-bold">
        {currency(value).replace(",", "")}
      </tspan>
    </text>
  );
};

export const DashboardPage = () => {
  const { data, loading } = useAsync(() => api.dashboard(), []);

  if (loading || !data) return <Loader />;

  const overviewData = [
    { name: "Total Balance", value: Math.max(Math.abs(data.cards.balance), 1), color: dashboardColors.balance },
    { name: "Total Expenses", value: Math.max(data.cards.expenses, 1), color: dashboardColors.expense },
    { name: "Total Income", value: Math.max(data.cards.income, 1), color: dashboardColors.income }
  ];

  return (
    <div className="grid gap-8">
      <div className="grid gap-8 xl:grid-cols-3">
        <DashboardStat title="Total Balance" value={currency(data.cards.balance)} tone="balance" icon={WalletCards} />
        <DashboardStat title="Total Income" value={currency(data.cards.income)} tone="income" icon={Wallet} />
        <DashboardStat title="Total Expenses" value={currency(data.cards.expenses)} tone="expense" icon={CreditCard} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-slate-100 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-8 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Recent Transactions</h2>
            <a
              href="/transactions"
              className="inline-flex items-center justify-center gap-3 rounded-md bg-slate-50 px-5 py-3 text-sm font-bold text-[#34313c] transition hover:bg-slate-100"
            >
              See All
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <RecentTransactions transactions={data.recent} />
        </section>

        <section className="rounded-lg border border-slate-100 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Financial Overview</h2>
          <div className="mt-6 h-[430px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={overviewData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="83%"
                  startAngle={0}
                  endAngle={360}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {overviewData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => currency(value)} />
                <CenterLabel value={data.cards.balance} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-9">
            {overviewData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-base font-bold text-[#34313c] dark:text-slate-200">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
