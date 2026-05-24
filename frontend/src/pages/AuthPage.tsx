import { zodResolver } from "@hookform/resolvers/zod";
import { WalletCards } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters")
});

type AuthForm = z.infer<typeof schema>;

export const AuthPage = ({ mode }: { mode: "login" | "register" }) => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthForm>({ resolver: zodResolver(schema) });

  if (user) return <Navigate to="/" replace />;

  const submit = async (data: AuthForm) => {
    try {
      if (mode === "register") {
        await register({ name: data.name || "New user", email: data.email, password: data.password });
      } else {
        await login({ email: data.email, password: data.password });
      }
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    }
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-mint p-3 text-white">
              <WalletCards className="h-7 w-7" />
            </span>
            <h1 className="text-3xl font-bold text-ink dark:text-white">Expense Tracker</h1>
          </div>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Track cashflow, budgets, and category trends with a focused workspace for everyday money decisions.
          </p>
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {["HTTP-only auth", "CSV exports", "Budget controls"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-ink shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                {item}
              </div>
            ))}
          </div>
        </section>
        <form onSubmit={handleSubmit(submit)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-ink dark:text-white">{mode === "login" ? "Log in" : "Create account"}</h2>
          <div className="mt-6 grid gap-4">
            {mode === "register" ? (
              <label className="grid gap-1">
                <span className="label">Name</span>
                <input className="field" {...formRegister("name")} />
              </label>
            ) : null}
            <label className="grid gap-1">
              <span className="label">Email</span>
              <input className="field" type="email" {...formRegister("email")} />
              {errors.email ? <span className="text-xs text-coral">{errors.email.message}</span> : null}
            </label>
            <label className="grid gap-1">
              <span className="label">Password</span>
              <input className="field" type="password" {...formRegister("password")} />
              {errors.password ? <span className="text-xs text-coral">{errors.password.message}</span> : null}
            </label>
          </div>
          <button className="btn-primary mt-6 w-full" disabled={isSubmitting}>
            {mode === "login" ? "Log in" : "Register"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === "login" ? "Need an account? " : "Already registered? "}
            <Link className="font-semibold text-mint" to={mode === "login" ? "/register" : "/login"}>
              {mode === "login" ? "Register" : "Log in"}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
