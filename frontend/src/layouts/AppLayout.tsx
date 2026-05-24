import { CreditCard, DollarSign, LayoutGrid, LogOut, Menu, Moon, Sun, UserRound, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/income", label: "Income", icon: DollarSign },
  { to: "/expense", label: "Expense", icon: CreditCard },
  { to: "/transactions", label: "Transactions", icon: WalletCards }
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const nav = (
    <nav className="grid gap-3">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          end={to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-md px-6 py-4 text-base font-semibold transition ${
              isActive
                ? "bg-[#7c3ff2] text-white shadow-[0_14px_30px_rgba(124,63,242,0.28)]"
                : "text-[#24232a] hover:bg-[#f4efff] hover:text-[#7c3ff2] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`
          }
        >
          <Icon className="h-6 w-6" strokeWidth={2.2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#17141d] dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white px-4 py-5 shadow-[0_1px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-950 lg:px-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Expense Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[73px] z-20 hidden w-[326px] border-r border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <div className="flex flex-col items-center py-6">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#dceafe] text-[#7c3ff2]">
            <UserRound className="h-12 w-12" strokeWidth={2} />
          </div>
          <p className="mt-6 text-xl font-bold text-[#17141d] dark:text-white">{user?.name || "Mike William"}</p>
        </div>
        <div className="mt-8">{nav}</div>
        <button
          className="mt-3 flex w-full items-center gap-4 rounded-md px-6 py-4 text-base font-semibold text-[#24232a] transition hover:bg-[#fff0f0] hover:text-coral dark:text-slate-300"
          onClick={signOut}
        >
          <LogOut className="h-6 w-6" />
          Logout
        </button>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="relative h-full w-72 bg-white p-4 shadow-soft dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="font-bold">Expense Tracker</p>
              <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6">{nav}</div>
            <button
              className="mt-3 flex w-full items-center gap-4 rounded-md px-6 py-4 text-base font-semibold text-[#24232a] transition hover:bg-[#fff0f0] hover:text-coral dark:text-slate-300"
              onClick={signOut}
            >
              <LogOut className="h-6 w-6" />
              Logout
            </button>
          </aside>
        </div>
      ) : null}

      <main className="px-4 py-7 lg:ml-[326px] lg:px-7">
        <Outlet />
      </main>
    </div>
  );
};
