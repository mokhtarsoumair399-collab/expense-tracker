import { Edit2, Trash2 } from "lucide-react";
import { DynamicIcon } from "../lib/icons";
import { currency, shortDate } from "../lib/format";
import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

export const TransactionTable = ({ transactions, onEdit, onDelete }: Props) => {
  if (!transactions.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr className="text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <DynamicIcon name={transaction.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-ink dark:text-white">{transaction.description}</p>
                      {transaction.tags?.length ? (
                        <p className="text-xs text-slate-500">{transaction.tags.join(", ")}</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{transaction.category}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{shortDate(transaction.date)}</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    transaction.type === "income" ? "text-mint" : "text-coral"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {currency(transaction.amount)}
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {onEdit ? (
                        <button
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800 dark:hover:text-white"
                          onClick={() => onEdit(transaction)}
                          aria-label="Edit transaction"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          className="rounded-md p-2 text-slate-500 hover:bg-coral/10 hover:text-coral"
                          onClick={() => onDelete(transaction)}
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
