"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  RotateCcw,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Receipt,
  FileText,
  Hash,
  Calendar,
  ChevronDown,
  Sun,
  Moon,
  Inbox,
  Loader2,
} from "lucide-react";

// ---------------- Types ----------------
type TransactionType = "Deposit" | "Withdrawal" | "Purchase" | "Refund";
type TransactionStatus = "Completed" | "Pending" | "Failed";

interface Transaction {
  id: string;
  title: string;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string; // ISO
  paymentMethod: string;
  reference: string;
}

// ---------------- Demo Data ----------------
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-10293",
    title: "Wallet Deposit",
    description: "Top-up via UPI from HDFC Bank",
    type: "Deposit",
    amount: 2500,
    status: "Completed",
    date: "2025-01-14T10:24:00Z",
    paymentMethod: "UPI",
    reference: "UPI-8821940012",
  },
  {
    id: "TXN-10294",
    title: "Free Fire Diamonds",
    description: "1000 Diamonds • UID 4821903",
    type: "Purchase",
    amount: 899,
    status: "Completed",
    date: "2025-01-14T09:12:00Z",
    paymentMethod: "Wallet",
    reference: "FF-99210034",
  },
  {
    id: "TXN-10295",
    title: "Withdrawal to Bank",
    description: "Transfer to ICICI •••• 4421",
    type: "Withdrawal",
    amount: 3200,
    status: "Pending",
    date: "2025-01-13T22:45:00Z",
    paymentMethod: "Bank Transfer",
    reference: "WDL-77210034",
  },
  {
    id: "TXN-10296",
    title: "PUBG UC",
    description: "660 UC • Character ID 5129840",
    type: "Purchase",
    amount: 799,
    status: "Completed",
    date: "2025-01-13T18:02:00Z",
    paymentMethod: "Wallet",
    reference: "PUBG-11234567",
  },
  {
    id: "TXN-10297",
    title: "Refund — Mobile Legends",
    description: "Order failed, amount refunded",
    type: "Refund",
    amount: 450,
    status: "Completed",
    date: "2025-01-13T15:30:00Z",
    paymentMethod: "Wallet",
    reference: "RF-22110045",
  },
  {
    id: "TXN-10298",
    title: "Mobile Legends Diamonds",
    description: "568 Diamonds • ID 8291034",
    type: "Purchase",
    amount: 450,
    status: "Failed",
    date: "2025-01-13T14:10:00Z",
    paymentMethod: "Debit Card",
    reference: "ML-99887766",
  },
  {
    id: "TXN-10299",
    title: "Telegram Premium",
    description: "3 months subscription",
    type: "Purchase",
    amount: 599,
    status: "Completed",
    date: "2025-01-12T20:55:00Z",
    paymentMethod: "Wallet",
    reference: "TG-33221100",
  },
  {
    id: "TXN-10300",
    title: "TikTok Coins",
    description: "5000 Coins • @creator_01",
    type: "Purchase",
    amount: 1299,
    status: "Completed",
    date: "2025-01-12T19:02:00Z",
    paymentMethod: "Wallet",
    reference: "TT-44556677",
  },
  {
    id: "TXN-10301",
    title: "Wallet Deposit",
    description: "Top-up via Net Banking • SBI",
    type: "Deposit",
    amount: 5000,
    status: "Completed",
    date: "2025-01-12T11:40:00Z",
    paymentMethod: "Net Banking",
    reference: "NB-11223344",
  },
  {
    id: "TXN-10302",
    title: "Withdrawal to Bank",
    description: "Transfer to SBI •••• 7712",
    type: "Withdrawal",
    amount: 1500,
    status: "Completed",
    date: "2025-01-11T23:15:00Z",
    paymentMethod: "Bank Transfer",
    reference: "WDL-55443322",
  },
  {
    id: "TXN-10303",
    title: "Steam Wallet Code",
    description: "$25 Gift Card",
    type: "Purchase",
    amount: 2200,
    status: "Completed",
    date: "2025-01-11T17:20:00Z",
    paymentMethod: "Wallet",
    reference: "STM-99887123",
  },
  {
    id: "TXN-10304",
    title: "Free Fire Diamonds",
    description: "2100 Diamonds • UID 4821903",
    type: "Purchase",
    amount: 1799,
    status: "Pending",
    date: "2025-01-11T14:05:00Z",
    paymentMethod: "Wallet",
    reference: "FF-11223344",
  },
  {
    id: "TXN-10305",
    title: "Refund — PUBG UC",
    description: "Duplicate order refund",
    type: "Refund",
    amount: 799,
    status: "Completed",
    date: "2025-01-10T21:30:00Z",
    paymentMethod: "Wallet",
    reference: "RF-88776655",
  },
  {
    id: "TXN-10306",
    title: "Wallet Deposit",
    description: "Top-up via Credit Card",
    type: "Deposit",
    amount: 10000,
    status: "Completed",
    date: "2025-01-10T12:00:00Z",
    paymentMethod: "Credit Card",
    reference: "CC-99887766",
  },
  {
    id: "TXN-10307",
    title: "Spotify Premium",
    description: "1 month individual plan",
    type: "Purchase",
    amount: 119,
    status: "Completed",
    date: "2025-01-09T20:15:00Z",
    paymentMethod: "Wallet",
    reference: "SP-11223300",
  },
  {
    id: "TXN-10308",
    title: "Withdrawal to Bank",
    description: "Transfer to HDFC •••• 2210",
    type: "Withdrawal",
    amount: 4500,
    status: "Failed",
    date: "2025-01-09T16:45:00Z",
    paymentMethod: "Bank Transfer",
    reference: "WDL-77665544",
  },
  {
    id: "TXN-10309",
    title: "Netflix Standard",
    description: "1 month subscription renewal",
    type: "Purchase",
    amount: 649,
    status: "Completed",
    date: "2025-01-08T19:30:00Z",
    paymentMethod: "Wallet",
    reference: "NF-55443322",
  },
  {
    id: "TXN-10310",
    title: "Wallet Deposit",
    description: "Top-up via Google Pay",
    type: "Deposit",
    amount: 1500,
    status: "Completed",
    date: "2025-01-08T10:20:00Z",
    paymentMethod: "Google Pay",
    reference: "GP-33221100",
  },
  {
    id: "TXN-10311",
    title: "Refund — Steam Wallet",
    description: "Invalid code, amount refunded",
    type: "Refund",
    amount: 2200,
    status: "Pending",
    date: "2025-01-07T22:10:00Z",
    paymentMethod: "Wallet",
    reference: "RF-99887711",
  },
  {
    id: "TXN-10312",
    title: "Valorant Points",
    description: "2050 VP • Riot ID #7721",
    type: "Purchase",
    amount: 1999,
    status: "Completed",
    date: "2025-01-07T18:55:00Z",
    paymentMethod: "Wallet",
    reference: "VAL-11223344",
  },
  {
    id: "TXN-10313",
    title: "Withdrawal to Bank",
    description: "Transfer to Axis •••• 9988",
    type: "Withdrawal",
    amount: 2000,
    status: "Completed",
    date: "2025-01-06T14:00:00Z",
    paymentMethod: "Bank Transfer",
    reference: "WDL-55443311",
  },
  {
    id: "TXN-10314",
    title: "YouTube Premium",
    description: "Family plan • 1 month",
    type: "Purchase",
    amount: 299,
    status: "Completed",
    date: "2025-01-05T20:40:00Z",
    paymentMethod: "Wallet",
    reference: "YT-77889900",
  },
];

// ---------------- Helpers ----------------
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const typeConfig: Record<
  TransactionType,
  {
    icon: React.ElementType;
    label: string;
    bg: string;
    text: string;
    ring: string;
    glow: string;
  }
> = {
  Deposit: {
    icon: ArrowDownLeft,
    label: "Deposit",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
    glow: "shadow-emerald-500/20",
  },
  Withdrawal: {
    icon: ArrowUpRight,
    label: "Withdrawal",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/20",
    glow: "shadow-rose-500/20",
  },
  Purchase: {
    icon: ShoppingBag,
    label: "Purchase",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-500/20",
    glow: "shadow-sky-500/20",
  },
  Refund: {
    icon: RotateCcw,
    label: "Refund",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/20",
    glow: "shadow-violet-500/20",
  },
};

const statusConfig: Record<
  TransactionStatus,
  { icon: React.ElementType; bg: string; text: string; dot: string }
> = {
  Completed: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  Pending: {
    icon: Clock,
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Failed: {
    icon: XCircle,
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

// ---------------- Component ----------------
export default function Transactions() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | TransactionStatus>(
    "All",
  );
  const [openTypeMenu, setOpenTypeMenu] = useState(false);
  const [openStatusMenu, setOpenStatusMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_TRANSACTIONS.filter((t) => {
      if (typeFilter !== "All" && t.type !== typeFilter) return false;
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q)
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, typeFilter, statusFilter]);

  const totals = useMemo(() => {
    const deposits = DEMO_TRANSACTIONS.filter(
      (t) => t.type === "Deposit" && t.status !== "Failed",
    ).reduce((s, t) => s + t.amount, 0);
    const withdrawals = DEMO_TRANSACTIONS.filter(
      (t) => t.type === "Withdrawal" && t.status !== "Failed",
    ).reduce((s, t) => s + t.amount, 0);
    const balance = deposits - withdrawals;
    return {
      total: DEMO_TRANSACTIONS.length,
      deposits,
      withdrawals,
      balance,
    };
  }, []);

  const typeOptions: Array<"All" | TransactionType> = [
    "All",
    "Deposit",
    "Withdrawal",
    "Purchase",
    "Refund",
  ];
  const statusOptions: Array<"All" | TransactionStatus> = [
    "All",
    "Completed",
    "Pending",
    "Failed",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a14] dark:via-[#0d0d1a] dark:to-[#0a0a14] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-500/10 blur-3xl dark:from-indigo-500/20 dark:to-purple-600/10" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-emerald-400/10 blur-3xl dark:from-sky-500/15 dark:to-emerald-500/10" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-rose-400/10 to-amber-400/10 blur-3xl dark:from-rose-500/10 dark:to-amber-500/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">FinPay</span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 backdrop-blur-xl transition-all hover:scale-105 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform group-hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live activity
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            View your deposits, withdrawals, and purchases.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <SummaryCard
            label="Total Transactions"
            value={totals.total.toString()}
            hint="All time"
            icon={Receipt}
            gradient="from-indigo-500 to-purple-600"
            glow="shadow-indigo-500/20"
          />
          <SummaryCard
            label="Total Deposits"
            value={formatCurrency(totals.deposits)}
            hint="+12.4% this month"
            icon={TrendingUp}
            gradient="from-emerald-500 to-teal-600"
            glow="shadow-emerald-500/20"
            positive
          />
          <SummaryCard
            label="Total Withdrawals"
            value={formatCurrency(totals.withdrawals)}
            hint="-3.2% this month"
            icon={TrendingDown}
            gradient="from-rose-500 to-pink-600"
            glow="shadow-rose-500/20"
          />
          <SummaryCard
            label="Current Balance"
            value={formatCurrency(totals.balance)}
            hint="Available now"
            icon={Wallet}
            gradient="from-sky-500 to-blue-600"
            glow="shadow-sky-500/20"
            accent
          />
        </div>

        {/* Sticky search/filter bar */}
        <div className="sticky top-2 z-20 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/30 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, ID, reference…"
                  className="h-11 w-full rounded-xl border border-slate-200/70 bg-white/80 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Dropdown
                  label="Type"
                  value={typeFilter}
                  options={typeOptions}
                  open={openTypeMenu}
                  onToggle={() => setOpenTypeMenu((o) => !o)}
                  onSelect={(v) => {
                    setTypeFilter(v as "All" | TransactionType);
                    setOpenTypeMenu(false);
                  }}
                  icon={Filter}
                />
                <Dropdown
                  label="Status"
                  value={statusFilter}
                  options={statusOptions}
                  open={openStatusMenu}
                  onToggle={() => setOpenStatusMenu((o) => !o)}
                  onSelect={(v) => {
                    setStatusFilter(v as "All" | TransactionStatus);
                    setOpenStatusMenu(false);
                  }}
                />
              </div>
            </div>

            {/* Active filter chips */}
            {(typeFilter !== "All" || statusFilter !== "All" || search) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Active:
                </span>
                {search && (
                  <Chip onClear={() => setSearch("")}>Search: "{search}"</Chip>
                )}
                {typeFilter !== "All" && (
                  <Chip onClear={() => setTypeFilter("All")}>
                    Type: {typeFilter}
                  </Chip>
                )}
                {statusFilter !== "All" && (
                  <Chip onClear={() => setStatusFilter("All")}>
                    Status: {statusFilter}
                  </Chip>
                )}
                <button
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("All");
                    setStatusFilter("All");
                  }}
                  className="ml-auto text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              onReset={() => {
                setSearch("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
            />
          ) : (
            filtered.map((t, idx) => (
              <TransactionRow key={t.id} t={t} index={idx} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <span>
            Showing {filtered.length} of {DEMO_TRANSACTIONS.length} transactions
          </span>
          <span>Secured with end-to-end encryption • FinPay © 2025</span>
        </div>
      </div>
    </div>
  );
}

// ---------------- Sub Components ----------------

function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  gradient,
  glow,
  positive,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  positive?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-5">
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40`}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {value}
          </p>
          <p
            className={`mt-1 flex items-center gap-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
          >
            {hint}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {accent && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-60" />
      )}
    </div>
  );
}

function Dropdown({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all ${
          value !== "All"
            ? "border-indigo-400/50 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
            : "border-slate-200/70 bg-white/80 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20"
        }`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span className="hidden sm:inline">{label}:</span>
        <span>{value}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onToggle} />
          <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 py-1 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => onSelect(o)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5 ${
                  value === o
                    ? "bg-indigo-500/10 font-medium text-indigo-700 dark:text-indigo-300"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {o}
                {value === o && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      {children}
      <button
        onClick={onClear}
        className="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
      >
        <XCircle className="h-3 w-3" />
      </button>
    </span>
  );
}

function TransactionRow({ t, index }: { t: Transaction; index: number }) {
  const cfg = typeConfig[t.type];
  const sCfg = statusConfig[t.status];
  const Icon = cfg.icon;
  const SIcon = sCfg.icon;
  const isPositive = t.type === "Deposit" || t.type === "Refund";

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
      className="group animate-[fadeInUp_0.5s_ease-out_both] rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/70 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 sm:p-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${cfg.glow} sm:h-12 sm:w-12`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold sm:text-base">
                {t.title}
              </h3>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {t.description}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold tabular-nums sm:text-base ${
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {isPositive ? "+" : "−"}
                {formatCurrency(t.amount).replace(/^₹\s*/, "₹")}
              </p>
              <div className="mt-1 flex justify-end">
                <StatusBadge status={t.status} />
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-200/60 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{t.id}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDate(t.date)} • {formatTime(t.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3 w-3" />
              {t.paymentMethod}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              <span className="font-mono">{t.reference}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === "Pending" ? "animate-pulse" : ""}`}
      />
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200/70 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200/70 dark:bg-white/10 sm:h-12 sm:w-12" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-3 w-2/3 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="ml-auto h-4 w-16 rounded-full bg-slate-200/70 dark:bg-white/10" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 border-t border-slate-200/60 pt-3 dark:border-white/10">
            <div className="h-3 w-24 rounded-md bg-slate-200/70 dark:bg-white/10" />
            <div className="h-3 w-32 rounded-md bg-slate-200/70 dark:bg-white/10" />
            <div className="hidden h-3 w-20 rounded-md bg-slate-200/70 sm:block dark:bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
          <Inbox className="h-8 w-8 text-white" />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold">No transactions found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Try adjusting your filters or search query to find what you're looking
        for.
      </p>
      <button
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl"
      >
        <Loader2 className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  );
}
