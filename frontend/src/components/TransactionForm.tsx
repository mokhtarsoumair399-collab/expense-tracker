import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categoryIconMap } from "../lib/constants";
import type { Category, Transaction, TransactionType } from "../types";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  category: z.string().min(2, "Choose a category"),
  date: z.string().min(1, "Choose a date"),
  description: z.string().min(2, "Add a short description"),
  tags: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type Props = {
  categories: Category[];
  defaultType?: TransactionType;
  lockType?: boolean;
  editing?: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  onCancel?: () => void;
};

export const TransactionForm = ({ categories, defaultType = "expense", lockType = false, editing, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      amount: editing?.amount || 0,
      category: editing?.category || "",
      date: editing?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      description: editing?.description || "",
      tags: editing?.tags?.join(", ") || ""
    }
  });

  const type = watch("type");
  const options = categories.filter((category) => category.type === type);

  useEffect(() => {
    reset({
      type: editing?.type || defaultType,
      amount: editing?.amount || 0,
      category: editing?.category || "",
      date: editing?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      description: editing?.description || "",
      tags: editing?.tags?.join(", ") || ""
    });
  }, [editing, defaultType, reset]);

  const submit = async (data: FormData) => {
    await onSubmit({
      ...data,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      icon: categoryIconMap[data.category] || options.find((item) => item.name === data.category)?.icon
    });
    reset({
      type: defaultType,
      amount: 0,
      category: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      tags: ""
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="label">Type</span>
          <select className="field" {...register("type")} disabled={lockType && !editing}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="label">Amount</span>
          <input className="field" type="number" step="0.01" {...register("amount")} />
          {errors.amount ? <span className="text-xs text-coral">{errors.amount.message}</span> : null}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="label">Category</span>
          <select className="field" {...register("category")}>
            <option value="">Select category</option>
            {options.map((category) => (
              <option key={`${category.type}-${category.name}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <span className="text-xs text-coral">{errors.category.message}</span> : null}
        </label>
        <label className="grid gap-1">
          <span className="label">Date</span>
          <input className="field" type="date" {...register("date")} />
          {errors.date ? <span className="text-xs text-coral">{errors.date.message}</span> : null}
        </label>
      </div>
      <label className="grid gap-1">
        <span className="label">Description</span>
        <input className="field" {...register("description")} placeholder="Grocery run, client invoice, rent" />
        {errors.description ? <span className="text-xs text-coral">{errors.description.message}</span> : null}
      </label>
      <label className="grid gap-1">
        <span className="label">Tags</span>
        <input className="field" {...register("tags")} placeholder="optional, comma separated" />
      </label>
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel ? (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="btn-primary" disabled={isSubmitting}>
          <Save className="h-4 w-4" />
          {editing ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
};
