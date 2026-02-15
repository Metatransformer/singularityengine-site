"use client";
import { motion } from "framer-motion";

export interface Build {
  id: string;
  name: string;
  score: number;
  query: string;
  username: string;
  tweet_url: string;
  build_url: string;
}

function scoreClass(score: number) {
  if (score >= 7) return "score-high";
  if (score >= 4) return "score-mid";
  return "score-low";
}

export function BuildCard({ build, index = 0 }: { build: Build; index?: number }) {
  return (
    <motion.a
      href={build.build_url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-6 flex flex-col gap-3 cursor-pointer transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg truncate">{build.name}</h3>
        <span className={`text-sm font-mono font-bold ${scoreClass(build.score)}`}>
          {build.score}/10
        </span>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2">&ldquo;{build.query}&rdquo;</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-2">
        <a
          href={build.tweet_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00d4ff]"
          onClick={(e) => e.stopPropagation()}
        >
          @{build.username}
        </a>
        <span className="text-[#00d4ff]">View app →</span>
      </div>
    </motion.a>
  );
}
