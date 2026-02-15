"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/showcase", label: "Showcase" },
  { href: "https://github.com/Metatransformer/singularity-engine", label: "GitHub", external: true },
  { href: "https://discord.gg/clawd", label: "Discord", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-[#00d4ff]">⚡</span>
          <span>Singularity Engine</span>
        </Link>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          {links.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{l.label}</a>
            ) : (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            )
          )}
        </div>
        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 px-6 py-4 flex flex-col gap-3 text-sm text-gray-400">
          {links.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{l.label}</a>
            ) : (
              <Link key={l.href} href={l.href} className="hover:text-white" onClick={() => setOpen(false)}>{l.label}</Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
