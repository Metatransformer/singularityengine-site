"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Build, BuildCard } from "./components/BuildCard";

const API = "https://8mag3jdi5f.execute-api.us-east-1.amazonaws.com/api/builds";

const steps = [
  { icon: "🐦", title: "Tweet", desc: "Tweet @metatransformr with your app idea" },
  { icon: "🛡️", title: "Sanitize", desc: "Prompt is validated and sanitized" },
  { icon: "🧠", title: "Claude Builds", desc: "AI generates a full working app" },
  { icon: "🚀", title: "Deploy", desc: "App deploys live, link replied to your tweet" },
];

export default function Home() {
  const [builds, setBuilds] = useState<Build[]>([]);

  useEffect(() => {
    fetch(`${API}?per_page=6&sort=coolness`)
      .then((r) => r.json())
      .then((data) => setBuilds(Array.isArray(data) ? data : data.builds || []))
      .catch(() => {});
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/5 via-transparent to-transparent" />
        <div className="relative text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#00d4ff] text-sm font-mono mb-4 tracking-widest uppercase">v0.1 Beta — Experimental</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white glow leading-tight">
              Tweet it.<br />Build it.<br />Ship it.
            </h1>
            <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
              Tweet an app idea → AI builds it in 45 seconds → deploys live → replies with a link.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://x.com/metatransformr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#00d4ff] text-black font-semibold rounded-xl hover:bg-[#00b8e0] transition-colors"
              >
                Try on X →
              </a>
              <a
                href="https://github.com/Metatransformer/singularity-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/20 text-white rounded-xl hover:border-white/40 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="glass-card p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-xs text-[#00d4ff] font-mono mb-2">Step {i + 1}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live builds */}
      {builds.length > 0 && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Live Builds</h2>
            <p className="text-gray-400 text-center mb-12">Real apps built by real tweets</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((b, i) => (
                <BuildCard key={b.id} build={b} index={i} />
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/showcase" className="text-[#00d4ff] hover:underline text-sm">View all builds →</a>
            </div>
          </div>
        </section>
      )}

      {/* Deploy your own */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Deploy Your Own</h2>
          <p className="text-gray-400 mb-8">Run Singularity Engine on your own infrastructure</p>
          <div className="glass-card p-6 font-mono text-sm text-left inline-block">
            <span className="text-gray-500">$</span>{" "}
            <span className="text-[#00d4ff]">git clone</span>{" "}
            <span className="text-white">https://github.com/Metatransformer/singularity-engine.git</span>
          </div>
          <p className="text-gray-500 text-sm mt-4">See the README for setup instructions</p>
        </div>
      </section>
    </div>
  );
}
