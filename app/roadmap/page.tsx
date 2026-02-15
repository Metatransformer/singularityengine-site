"use client";
import { motion } from "framer-motion";

const phases = [
  {
    version: "v0.1",
    label: "Beta",
    status: "current",
    items: [
      "Tweet simple app ideas → get a live app back",
      "DynamoDB for build storage",
      "No auth required — just tweet",
      "Experimental quality — apps may be buggy",
    ],
  },
  {
    version: "v0.2",
    label: "Post-Launch",
    status: "next",
    items: [
      "Build from the website (not just Twitter)",
      "Live build previews",
      "Social sharing & embeds",
      "Showcase gallery with voting",
      "Error recovery & retry logic",
    ],
  },
  {
    version: "v0.3",
    label: "Next",
    status: "planned",
    items: [
      "Auth & user accounts",
      "Personal dashboard",
      "OpenClaw / agent integration",
      "Multi-model support (Claude, GPT, Gemini)",
      "Plugin system for custom templates",
    ],
  },
  {
    version: "Future",
    label: "Ideation",
    status: "ideation",
    items: [
      "Platform & marketplace for generated apps",
      "Monetization for builders",
      "The Mesh — interconnected AI-built apps",
      "Template marketplace",
    ],
  },
];

const statusColors: Record<string, string> = {
  current: "bg-[#00d4ff] text-black",
  next: "bg-[#00d4ff]/20 text-[#00d4ff]",
  planned: "bg-white/10 text-white",
  ideation: "bg-white/5 text-gray-400",
};

export default function Roadmap() {
  return (
    <div className="pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-4">Roadmap</h1>
          <p className="text-gray-400 mb-16">Where we&apos;re going and what&apos;s next</p>
        </motion.div>

        <div className="space-y-8">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.version}
              className="glass-card p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white font-mono">{phase.version}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[phase.status]}`}>
                  {phase.label}
                </span>
              </div>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-[#00d4ff] mt-1">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Have ideas? We&apos;d love to hear them.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/Metatransformer/singularity-engine/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/20 text-white text-sm rounded-xl hover:border-white/40 transition-colors"
            >
              GitHub Issues
            </a>
            <a
              href="https://discord.gg/clawd"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/20 text-white text-sm rounded-xl hover:border-white/40 transition-colors"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
