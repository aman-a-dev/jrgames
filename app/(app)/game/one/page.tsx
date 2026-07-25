"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Wallet,
  User,
  Search,
  ChevronDown,
  Zap,
  Trophy,
  Clock,
  X,
  CircleDot,
  Sparkles,
} from "lucide-react";

// ==========================================
// DATA
// ==========================================
const teams = [
  { id: 1, name: "Arsenal", color: "#ef4444" },
  { id: 2, name: "Chelsea", color: "#2563eb" },
  { id: 3, name: "Barcelona", color: "#7c3aed" },
  { id: 4, name: "Liverpool", color: "#dc2626" },
  { id: 5, name: "Real Madrid", color: "#f8fafc" },
  { id: 6, name: "PSG", color: "#1e3a8a" },
  { id: 7, name: "Juventus", color: "#000000" },
  { id: 8, name: "Bayern", color: "#dc2626" },
  { id: 9, name: "Milan", color: "#dc2626" },
  { id: 10, name: "Inter", color: "#1d4ed8" },
  { id: 11, name: "Man City", color: "#67e8f9" },
  { id: 12, name: "Man Utd", color: "#b91c1c" },
  { id: 13, name: "Tottenham", color: "#f8fafc" },
  { id: 14, name: "Newcastle", color: "#000000" },
  { id: 15, name: "Brighton", color: "#2563eb" },
  { id: 16, name: "West Ham", color: "#7c2d12" },
  { id: 17, name: "Brentford", color: "#dc2626" },
  { id: 18, name: "Burnley", color: "#7c3aed" },
  { id: 19, name: "Aston Villa", color: "#7c3aed" },
  { id: 20, name: "Everton", color: "#1d4ed8" },
  { id: 21, name: "Crystal P.", color: "#1d4ed8" },
  { id: 22, name: "Fulham", color: "#f8fafc" },
  { id: 23, name: "Leicester", color: "#2563eb" },
  { id: 24, name: "Wolves", color: "#f59e0b" },
];

// ==========================================
// UI PRIMITIVES (Inline shadcn-style)
// ==========================================
const GlassCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "chip";
  className?: string;
  [key: string]: any;
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40",
    outline:
      "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    chip: "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 font-medium",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// HEADER & WALLET
// ==========================================
const Header = () => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex items-center justify-between px-4 py-3"
  >
    <div className="flex items-center gap-3">
      <Button variant="ghost" className="p-2.5 !rounded-xl">
        <Menu size={20} />
      </Button>
      <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        Z-Games
      </h1>
    </div>

    <div className="flex items-center gap-3">
      <GlassCard className="px-3 py-1.5 flex items-center gap-2 !rounded-full border-purple-500/30 bg-purple-500/5">
        <Wallet size={14} className="text-purple-400" />
        <span className="text-sm font-bold text-white">120 Birr</span>
      </GlassCard>
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <ChevronDown size={14} className="text-zinc-400" />
      </div>
    </div>
  </motion.header>
);

// ==========================================
// ROUND & STATS
// ==========================================
const RoundCard = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="flex justify-center my-4"
  >
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2">
      <Zap size={16} className="text-white" fill="white" />
      <span className="text-sm font-bold text-white">Current Game #2314</span>
    </div>
  </motion.div>
);

const StatsCard = ({ icon: Icon, label, value, color }: any) => (
  <GlassCard className="p-4 flex-1 flex flex-col items-center justify-center gap-1">
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center ${color.bg}`}
    >
      <Icon size={16} className={color.text} />
    </div>
    <p className="text-xs text-zinc-500 font-medium">{label}</p>
    <p className={`text-lg font-bold ${color.text}`}>{value}</p>
  </GlassCard>
);

const Stats = ({ time }: { time: number }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-3 gap-3 px-4 mb-6"
  >
    <StatsCard
      icon={Trophy}
      label="Price"
      value="10 Birr"
      color={{ bg: "bg-orange-500/10", text: "text-orange-400" }}
    />
    <StatsCard
      icon={Sparkles}
      label="Reward"
      value="25.5 Birr"
      color={{ bg: "bg-emerald-500/10", text: "text-emerald-400" }}
    />
    <StatsCard
      icon={Clock}
      label="Starts In"
      value={`00:${time.toString().padStart(2, "0")}`}
      color={{ bg: "bg-blue-500/10", text: "text-blue-400" }}
    />
  </motion.div>
);

// ==========================================
// SPINNER WHEEL
// ==========================================
const getSlicePath = (index: number, total: number, radius: number) => {
  const startAngle = (index * 360) / total - 90;
  const endAngle = ((index + 1) * 360) / total - 90;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = radius + radius * Math.cos(startRad);
  const y1 = radius + radius * Math.sin(startRad);
  const x2 = radius + radius * Math.cos(endRad);
  const y2 = radius + radius * Math.sin(endRad);
  const largeArcFlag = 360 / total > 180 ? 1 : 0;
  return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

const SpinnerWheel = ({ rotation }: { rotation: number }) => {
  const radius = 250;
  const totalSlices = 24;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="relative flex items-center justify-center my-8"
    >
      {/* Pointer (Fixed on top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
          <path
            d="M16 48 C16 48 0 24 0 16 C0 7.16 7.16 0 16 0 C24.84 0 32 7.16 32 16 C32 24 16 48 16 48Z"
            fill="url(#pointerGrad)"
          />
          <defs>
            <linearGradient
              id="pointerGrad"
              x1="16"
              y1="0"
              x2="16"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="6" fill="#fff" />
        </svg>
      </div>

      {/* Wheel Container */}
      <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[560px] lg:h-[560px]">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl" />

        <motion.svg
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="w-full h-full drop-shadow-2xl"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          {/* Outer Ring */}
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="#18181b"
            stroke="#3f3f46"
            strokeWidth="4"
          />

          {/* Slices */}
          {teams.map((team, i) => {
            const path = getSlicePath(i, totalSlices, radius - 10);
            const textAngle =
              (i * 360) / totalSlices + 360 / totalSlices / 2 - 90;
            const textRadius = radius * 0.75;
            const textX =
              radius + textRadius * Math.cos((textAngle * Math.PI) / 180);
            const textY =
              radius + textRadius * Math.sin((textAngle * Math.PI) / 180);

            return (
              <g key={team.id}>
                <path
                  d={path}
                  fill={team.color}
                  stroke="#09090b"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                  className="drop-shadow-md"
                >
                  {team.name}
                </text>
              </g>
            );
          })}

          {/* Center Hub */}
          <circle
            cx={radius}
            cy={radius}
            r="35"
            fill="#09090b"
            stroke="#3f3f46"
            strokeWidth="4"
          />
          <circle cx={radius} cy={radius} r="20" fill="url(#hubGrad)" />
          <defs>
            <radialGradient id="hubGrad">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#7e22ce" />
            </radialGradient>
          </defs>
        </motion.svg>
      </div>
    </motion.div>
  );
};

// ==========================================
// SELECTION CARD
// ==========================================
const SelectionCard = ({
  selectedTeam,
  betAmount,
}: {
  selectedTeam: any;
  betAmount: number;
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="px-4 mb-6"
  >
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-400">Your Selection</h3>
        <CircleDot size={16} className="text-purple-400" />
      </div>

      <AnimatePresence mode="wait">
        {selectedTeam ? (
          <motion.div
            key={selectedTeam.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: selectedTeam.color }}
            >
              {selectedTeam.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">
                {selectedTeam.name}
              </p>
              <p className="text-sm text-zinc-400">
                Bet:{" "}
                <span className="text-emerald-400 font-semibold">
                  {betAmount} Birr
                </span>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <p className="text-zinc-500">No team selected</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  </motion.div>
);

// ==========================================
// BOTTOM SHEET (Teams & Betting)
// ==========================================
const BottomSheet = ({
  selectedTeam,
  setSelectedTeam,
  betAmount,
  setBetAmount,
}: any) => {
  const [search, setSearch] = useState("");
  const quickChips = [10, 20, 50, 100, 200];

  const filteredTeams = useMemo(
    () =>
      teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <GlassCard className="rounded-t-[2.5rem] border-b-0 bg-zinc-950/90 max-h-[70vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        <div className="px-5 pb-5 overflow-y-auto custom-scrollbar">
          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
            {filteredTeams.map((team) => (
              <motion.button
                key={team.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTeam(team)}
                className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                  selectedTeam?.id === team.id
                    ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10 scale-105"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {team.name}
              </motion.button>
            ))}
          </div>

          {/* Betting Section */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-2 block">
                Bet Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount || ""}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-lg font-bold text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
                  Birr
                </span>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickChips.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    betAmount === amount
                      ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Place Bet Button */}
            <Button
              variant="primary"
              className="w-full py-4 text-base !rounded-2xl mt-2"
              disabled={!selectedTeam || !betAmount}
            >
              Place Bet
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function SpinnerGamePage() {
  const [time, setTime] = useState(14);
  const [rotation, setRotation] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [betAmount, setBetAmount] = useState(0);

  // Countdown Timer
  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset for demo purposes
      setTime(14);
      setRotation((prev) => prev + 1440 + Math.random() * 720); // Auto spin on reset
    }
  }, [time]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-black" />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mx-auto pb-[450px]">
        {" "}
        {/* pb to account for bottom sheet */}
        <Header />
        <RoundCard />
        <Stats time={time} />
        <div className="px-4">
          <SpinnerWheel rotation={rotation} />
        </div>
        <SelectionCard selectedTeam={selectedTeam} betAmount={betAmount} />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
      />
    </div>
  );
}
