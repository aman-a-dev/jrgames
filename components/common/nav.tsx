"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";

const NAV_LINKS = [
  { label: "HOME", href: "/home" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

// Timing constants so the intro sequence, the bar, and the links all agree
// on when they're allowed to start.
const INTRO_HOLD = 0.9; // how long the lone controller sits before splitting
const SPLIT_DURATION = 0.8;
const BAR_DELAY = INTRO_HOLD + 0.15;
const LINKS_DELAY = BAR_DELAY + SPLIT_DURATION - 0.25;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      {/* ---------------------------------------------------------------
         Step 1: the lone controller, only visible for the intro beat.
         It fades out right as the two halves take over.
      --------------------------------------------------------------- */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4, delay: INTRO_HOLD - 0.1 }}
      >
        <Image
          src="/controller-full.png"
          alt="controller-full"
          width={140}
          height={90}
          priority
        />
      </motion.div>

      {/* ---------------------------------------------------------------
         Step 2 + 3: the actual nav bar, built from three pieces that
         animate in together: left half, center bar, right half.
      --------------------------------------------------------------- */}
      <div className="relative flex items-center justify-center px-2 pt-3 sm:px-4">
        {/* Left controller half — slides in from off-screen left */}
        <motion.div
          className="relative z-10 shrink-0"
          initial={{ x: -160, opacity: 0, rotate: -8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: INTRO_HOLD,
            duration: SPLIT_DURATION,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src="/controller-left.png"
            alt="controller-left"
            width={90}
            height={70}
            className="h-auto w-14 sm:w-20 md:w-24"
          />
        </motion.div>

        <motion.div
          className="relative -mx-4 flex min-w-0 flex-1 max-w-4xl flex-col overflow-hidden rounded bg-background shadow-lg sm:-mx-6"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            delay: BAR_DELAY,
            duration: SPLIT_DURATION,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* Top row: logo (always) + desktop links/CTA + mobile menu btn */}
          <div className="flex items-center justify-between h-10 gap-4 px-6 sm:px-8">
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>
            <ThemeSwitcher />
            {/* Desktop / laptop: inline links + Sign in, single thin bar */}
            <motion.nav
              className="hidden items-center gap-8 md:flex"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LINKS_DELAY, duration: 0.5 }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wide transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Button nativeButton={false} render={<Link href="/auth" />}>
                Sign in
              </Button>
            </motion.nav>

            {/* Mobile / tablet: hamburger toggle */}
            <motion.button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LINKS_DELAY, duration: 0.5 }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>

          {/* Mobile / tablet dropdown panel — HOME / ABOUT / CONTACT stacked
             plus Sign in, matching the "vertical menu" reference state. */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-panel"
                className="overflow-hidden border-t border-white/10 md:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav className="flex flex-col items-center gap-6 px-6 py-8">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium tracking-wide transition-colors hover:text-white"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  <Button
                    render={<Link href="/auth" />}
                    nativeButton={false}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right controller half — slides in from off-screen right */}
        <motion.div
          className="relative z-10 shrink-0"
          initial={{ x: 160, opacity: 0, rotate: 8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{
            delay: INTRO_HOLD,
            duration: SPLIT_DURATION,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src="/controller-right.png"
            alt=""
            width={90}
            height={70}
            className="h-auto w-14 sm:w-20 md:w-24"
          />
        </motion.div>
      </div>
    </header>
  );
}
