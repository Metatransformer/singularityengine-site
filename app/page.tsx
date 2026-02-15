"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────
type TabId = 0 | 1 | 2 | 3
const TAB_LABELS = ["Engine", "Builds", "Roadmap", "Legal"] as const

type Build = {
  id: string
  name: string
  score: number
  query: string
  username: string
  tweet_url: string
  build_url: string
}

// ─── Color tokens ───────────────────────────────────────────────────────────
const C = {
  green: "#3ddc84",
  teal: "#14f5c8",
  purple: "#a78bfa",
  text: "#8899aa",
  textBright: "#9aabb8",
  title: "#e8edf2",
  dim: "#607888",
  label: "rgba(20,245,200,0.7)",
  labelPurple: "rgba(167,139,250,0.7)",
} as const

const COLORS = [C.green, C.teal, C.purple]
const BUILDS_API = "https://8mag3jdi5f.execute-api.us-east-1.amazonaws.com/api/builds"

// ─── Low Poly Background ────────────────────────────────────────────────────
function PolyBG() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 900">
      <polygon points="0,0 200,50 150,200 0,180" fill="#1a1a1a" />
      <polygon points="200,50 400,0 350,150 150,200" fill="#111" />
      <polygon points="400,0 600,80 500,250 350,150" fill="#161616" />
      <polygon points="600,80 850,0 800,200 500,250" fill="#0d0d0d" />
      <polygon points="850,0 1200,0 1200,180 800,200" fill="#141414" />
      <polygon points="0,180 150,200 100,400 0,380" fill="#0f0f0f" />
      <polygon points="150,200 350,150 400,350 100,400" fill="#1c1c1c" />
      <polygon points="350,150 500,250 550,400 400,350" fill="#0a0a0a" />
      <polygon points="500,250 800,200 750,420 550,400" fill="#181818" />
      <polygon points="800,200 1200,180 1200,400 750,420" fill="#121212" />
      <polygon points="0,380 100,400 80,600 0,580" fill="#151515" />
      <polygon points="100,400 400,350 450,580 80,600" fill="#0b0b0b" />
      <polygon points="400,350 550,400 600,600 450,580" fill="#1e1e1e" />
      <polygon points="550,400 750,420 780,620 600,600" fill="#0e0e0e" />
      <polygon points="750,420 1200,400 1200,600 780,620" fill="#171717" />
      <polygon points="0,580 80,600 50,800 0,780" fill="#131313" />
      <polygon points="80,600 450,580 500,800 50,800" fill="#090909" />
      <polygon points="450,580 600,600 650,820 500,800" fill="#1b1b1b" />
      <polygon points="600,600 780,620 800,850 650,820" fill="#101010" />
      <polygon points="780,620 1200,600 1200,900 800,850" fill="#161616" />
      <polygon points="0,780 50,800 0,900" fill="#0c0c0c" />
      <polygon points="50,800 500,800 400,900 0,900" fill="#191919" />
      <polygon points="500,800 650,820 700,900 400,900" fill="#0d0d0d" />
      <polygon points="650,820 800,850 1000,900 700,900" fill="#141414" />
      <polygon points="800,850 1200,900 1000,900" fill="#111" />
      <g stroke="#333" strokeWidth="0.5" fill="none">
        <line x1="0" y1="0" x2="200" y2="50" />
        <line x1="200" y1="50" x2="400" y2="0" />
        <line x1="400" y1="0" x2="600" y2="80" />
        <line x1="600" y1="80" x2="850" y2="0" />
        <line x1="0" y1="180" x2="150" y2="200" />
        <line x1="150" y1="200" x2="350" y2="150" />
        <line x1="350" y1="150" x2="500" y2="250" />
        <line x1="500" y1="250" x2="800" y2="200" />
        <line x1="800" y1="200" x2="1200" y2="180" />
        <line x1="0" y1="380" x2="100" y2="400" />
        <line x1="100" y1="400" x2="400" y2="350" />
        <line x1="400" y1="350" x2="550" y2="400" />
        <line x1="550" y1="400" x2="750" y2="420" />
        <line x1="750" y1="420" x2="1200" y2="400" />
        <line x1="0" y1="580" x2="80" y2="600" />
        <line x1="80" y1="600" x2="450" y2="580" />
        <line x1="450" y1="580" x2="600" y2="600" />
        <line x1="600" y1="600" x2="780" y2="620" />
        <line x1="780" y1="620" x2="1200" y2="600" />
        <line x1="150" y1="200" x2="100" y2="400" />
        <line x1="350" y1="150" x2="400" y2="350" />
        <line x1="500" y1="250" x2="550" y2="400" />
        <line x1="800" y1="200" x2="750" y2="420" />
        <line x1="100" y1="400" x2="80" y2="600" />
        <line x1="400" y1="350" x2="450" y2="580" />
        <line x1="550" y1="400" x2="600" y2="600" />
        <line x1="750" y1="420" x2="780" y2="620" />
      </g>
    </svg>
  )
}

// ─── Builds Hook ────────────────────────────────────────────────────────────
function useBuilds(page: number, sort: string, search: string, perPage = 10) {
  const [builds, setBuilds] = useState<Build[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page + 1),
      per_page: String(perPage),
      sort,
    })
    if (search) params.set("search", search)
    fetch(`${BUILDS_API}?${params}`)
      .then((r) => r.json())
      .then((data: { builds: Build[]; total: number }) => {
        setBuilds(data.builds || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => { setBuilds([]); setTotal(0); setLoading(false) })
  }, [page, sort, search, perPage])

  return { builds, total, loading }
}

// ─── Build List Component ───────────────────────────────────────────────────
function BuildList({ builds, loading }: { builds: Build[]; loading: boolean }) {
  if (loading) return <p className="text-xs font-mono mt-2" style={{ color: C.dim }}>Loading builds...</p>
  if (!builds.length) return <p className="text-xs font-mono mt-2" style={{ color: C.dim }}>No builds found</p>

  return (
    <div className="space-y-2 mt-2">
      {builds.map((build, i) => {
        const color = COLORS[i % COLORS.length]
        return (
          <div key={build.id} className="build-row p-2" style={{ border: `1px solid ${color}15` }}>
            <div className="flex items-center gap-2 mb-1">
              <a href={build.build_url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs md:text-sm font-bold truncate hover:opacity-80 transition-opacity"
                style={{ color: C.title }}>{build.name}</a>
            </div>
            <p className="font-mono text-[10px] md:text-xs truncate mb-1" style={{ color: C.dim }}>&quot;{build.query}&quot;</p>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="font-mono text-[9px] flex-shrink-0 mr-1" style={{ color: `${color}aa` }}>coolness</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `${color}15` }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, build.score))}%`, background: `${color}cc` }} />
              </div>
              <span className="font-mono text-[9px] font-bold flex-shrink-0 ml-1 tabular-nums" style={{ color: `${color}cc` }}>{build.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <a href={build.tweet_url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] hover:opacity-80 transition-opacity" style={{ color: `${C.teal}99` }}>@{build.username}</a>
              <a href={build.tweet_url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] hover:opacity-80 transition-opacity" style={{ color: `${C.purple}88` }}>tweet ↗</a>
              <a href={build.build_url} target="_blank" rel="noopener noreferrer"
                className="ml-auto font-mono text-[10px] hover:opacity-80 transition-opacity" style={{ color: `${color}88` }}>view build →</a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Pagination ─────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-2 mt-3">
      <button className="text-xs font-mono px-2 py-0.5"
        style={{ color: page > 0 ? `${C.green}cc` : `${C.green}30`, background: "none", border: `1px solid ${page > 0 ? `${C.green}30` : `${C.green}10`}`, cursor: page > 0 ? "pointer" : "default" }}
        onClick={() => page > 0 && onPageChange(page - 1)} disabled={page === 0}>←</button>
      <span className="text-[10px] font-mono" style={{ color: C.dim }}>{page + 1}/{totalPages}</span>
      <button className="text-xs font-mono px-2 py-0.5"
        style={{ color: page < totalPages - 1 ? `${C.green}cc` : `${C.green}30`, background: "none", border: `1px solid ${page < totalPages - 1 ? `${C.green}30` : `${C.green}10`}`, cursor: page < totalPages - 1 ? "pointer" : "default" }}
        onClick={() => page < totalPages - 1 && onPageChange(page + 1)} disabled={page >= totalPages - 1}>→</button>
    </div>
  )
}

// ─── Engine Tab ─────────────────────────────────────────────────────────────
function EngineTab() {
  const [feedPage, setFeedPage] = useState(0)
  const { builds, total, loading } = useBuilds(feedPage, "created_at", "", 6)
  const totalPages = Math.max(1, Math.ceil(total / 6))

  return (
    <div className="engine-grid-3">
      {/* Left top: Try It */}
      <div className="engine-pane-left">
        <p className="tile-section-label" style={{ color: C.label }}>// TRY IT</p>
        <h4 className="tile-title mb-3" style={{ color: C.green }}>Tweet it. Build it. Ship it.</h4>
        <p className="text-xs md:text-sm font-mono leading-relaxed mb-4" style={{ color: C.textBright }}>
          Tweet any app idea at <span style={{ color: C.teal }}>@metatransformr</span> and watch it build in real time. ~60 seconds from tweet to live app.
        </p>
        <div className="space-y-2">
          <a href="https://x.com/metatransformr" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 font-mono text-sm transition-all hover:opacity-90"
            style={{ border: `1px solid ${C.teal}30`, background: `${C.teal}08` }}>
            <span className="text-lg">𝕏</span>
            <div>
              <div className="font-bold" style={{ color: C.title }}>Tweet @metatransformr</div>
              <div className="text-[10px] md:text-xs mt-0.5" style={{ color: C.dim }}>Request a build or see recent deploys</div>
            </div>
          </a>
          <a href="https://github.com/Metatransformer/singularity-engine" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 font-mono text-sm transition-all hover:opacity-90"
            style={{ border: `1px solid ${C.green}30`, background: `${C.green}08` }}>
            <span className="text-lg">◈</span>
            <div>
              <div className="font-bold" style={{ color: C.title }}>GitHub — Singularity Engine</div>
              <div className="text-[10px] md:text-xs mt-0.5" style={{ color: C.dim }}>Source code + all deployed apps</div>
            </div>
          </a>
        </div>
      </div>

      {/* Right: Live builds feed */}
      <div className="engine-pane-right engine-builds-tall">
        <p className="tile-section-label" style={{ color: C.label }}>// LIVE BUILDS</p>
        <BuildList builds={builds} loading={loading} />
        <Pagination page={feedPage} totalPages={totalPages} onPageChange={setFeedPage} />
      </div>

      {/* Left bottom: How it works */}
      <div className="engine-pane-left">
        <p className="tile-section-label" style={{ color: C.label }}>// HOW IT WORKS</p>
        <div className="pipeline-row">
          {[
            { icon: "𝕏", label: "TWEET", time: "0s", color: C.teal },
            { icon: "⬡", label: "SANITIZE", time: "1s", color: C.green },
            { icon: "⚡", label: "CLAUDE", time: "~45s", color: C.purple },
            { icon: "▲", label: "DEPLOY", time: "~5s", color: C.teal },
            { icon: "◈", label: "REPLY", time: "~10s", color: C.green },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              {i > 0 && <span className="pipeline-arrow" style={{ color: `${C.green}40` }}>▸</span>}
              <div className="pipeline-step">
                <div className="pipeline-box" style={{ borderColor: `${step.color}30`, background: "rgba(0,0,0,0.3)" }}>
                  <span className="pipeline-icon" style={{ color: `${step.color}cc` }}>{step.icon}</span>
                  <span className="pipeline-label" style={{ color: `${step.color}80` }}>{step.label}</span>
                </div>
                <span className="pipeline-time" style={{ color: C.dim }}>{step.time}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4 pt-3" style={{ borderTop: `1px solid ${C.green}15` }}>
          {[
            { value: "~60s", label: "TOTAL TIME", color: C.green },
            { value: "$0.10", label: "PER BUILD", color: C.teal },
            { value: "∞", label: "SCALE", color: C.purple },
            { value: "0", label: "HUMANS", color: C.green },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg md:text-2xl font-bold font-mono" style={{ color: `${stat.color}cc` }}>{stat.value}</div>
              <div className="text-[8px] md:text-[10px] font-mono tracking-[0.15em] mt-1" style={{ color: C.dim }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center mt-3 text-[10px] md:text-xs font-mono" style={{ color: C.dim }}>
          AWS Lambda • Claude Sonnet • GitHub Pages • X API
        </p>
      </div>
    </div>
  )
}

// ─── Builds Tab ─────────────────────────────────────────────────────────────
function BuildsTab() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<"created_at" | "coolness">("created_at")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const { builds, total, loading } = useBuilds(page, sort, search)
  const totalPages = Math.max(1, Math.ceil(total / 10))

  return (
    <div className="tile h-full" style={{ ["--tile-accent" as string]: C.green }}>
      <p className="tile-section-label" style={{ color: C.label }}>// BUILDS</p>
      <div className="flex items-center gap-2 mt-2 mb-3 flex-wrap">
        <div className="flex font-mono text-[10px]" style={{ border: `1px solid ${C.green}30` }}>
          <button onClick={() => { setSort("created_at"); setPage(0) }}
            className="px-2 py-1 transition-all"
            style={{ background: sort === "created_at" ? `${C.green}20` : "transparent", color: sort === "created_at" ? C.green : C.dim, border: "none", cursor: "pointer" }}>
            RECENT</button>
          <button onClick={() => { setSort("coolness"); setPage(0) }}
            className="px-2 py-1 transition-all"
            style={{ background: sort === "coolness" ? `${C.teal}20` : "transparent", color: sort === "coolness" ? C.teal : C.dim, border: "none", borderLeft: `1px solid ${C.green}30`, cursor: "pointer" }}>
            COOLEST</button>
        </div>
        <form className="flex-1 min-w-[120px]" onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(0) }}>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            onBlur={() => { setSearch(searchInput); setPage(0) }}
            placeholder="search builds..." className="w-full px-2 py-1 font-mono text-[10px] outline-none"
            style={{ background: `${C.green}08`, border: `1px solid ${C.green}20`, color: C.textBright }} />
        </form>
        <span className="font-mono text-[10px]" style={{ color: C.dim }}>{total} total</span>
      </div>
      <BuildList builds={builds} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

// ─── Roadmap Tab ────────────────────────────────────────────────────────────
function RoadmapTab() {
  const milestones = [
    {
      version: "v0.1 Beta",
      status: "LIVE",
      color: C.green,
      items: [
        "Tweet-to-app pipeline (AWS Lambda + Claude Sonnet)",
        "Auto-deploy to GitHub Pages",
        "Auto-reply with live link on X",
        "Basic prompt sanitization",
        "Coolness scoring system",
        "Public builds gallery",
      ],
    },
    {
      version: "v0.2",
      status: "NEXT",
      color: C.teal,
      items: [
        "Multi-file app generation (CSS, JS, assets)",
        "Framework support (React, Vue, Svelte)",
        "Build versioning & iteration (\"make it better\")",
        "User accounts & build history",
        "Custom domains for builds",
      ],
    },
    {
      version: "v0.3",
      status: "PLANNED",
      color: C.purple,
      items: [
        "Backend generation (API routes, databases)",
        "Multi-agent build pipeline",
        "Collaborative editing (fork & remix)",
        "Build analytics & monitoring",
        "Plugin system for custom pipelines",
      ],
    },
    {
      version: "Ideation",
      status: "EXPLORING",
      color: C.green,
      items: [
        "Voice-to-app (speak your idea)",
        "Autonomous improvement loops",
        "Cross-build composition (combine apps)",
        "Marketplace for generated apps",
        "Self-improving build agents",
      ],
    },
  ]

  return (
    <div className="split-panes-grid">
      {milestones.map((m) => (
        <div key={m.version} className="tile tile-pane" style={{ ["--tile-accent" as string]: m.color }}>
          <div className="flex items-center gap-2 mb-3">
            <p className="tile-section-label mb-0" style={{ color: `${m.color}aa` }}>// {m.version.toUpperCase()}</p>
            <span className="font-mono text-[9px] px-1.5 py-0.5 ml-auto"
              style={{ background: `${m.color}15`, color: `${m.color}cc`, border: `1px solid ${m.color}30` }}>{m.status}</span>
          </div>
          <h3 className="tile-title mb-3" style={{ color: m.color }}>{m.version}</h3>
          <div className="space-y-1.5">
            {m.items.map((item) => (
              <div key={item} className="flex items-start gap-2 font-mono text-xs md:text-sm">
                <span style={{ color: `${m.color}60` }}>▸</span>
                <span style={{ color: C.textBright }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Legal Tab ──────────────────────────────────────────────────────────────
function LegalTab() {
  return (
    <div className="split-panes-grid">
      <div className="tile tile-pane" style={{ ["--tile-accent" as string]: C.green }}>
        <p className="tile-section-label" style={{ color: C.label }}>// DISCLAIMER</p>
        <h3 className="tile-title mb-3" style={{ color: C.green }}>Disclaimer</h3>
        <p className="tile-text">
          Singularity Engine is provided as-is, without warranty of any kind. AI-generated applications
          may contain bugs, security issues, or unexpected behavior. Use at your own risk.
        </p>
      </div>
      <div className="tile tile-pane" style={{ ["--tile-accent" as string]: C.teal }}>
        <p className="tile-section-label" style={{ color: C.label }}>// ACCEPTABLE USE</p>
        <h3 className="tile-title mb-3" style={{ color: C.teal }}>Acceptable Use</h3>
        <div className="space-y-1.5">
          {[
            "No illegal or harmful content",
            "No prompt injection or attempts to exploit the system",
            "No data collection through generated apps",
            "No impersonation of individuals or organizations",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 font-mono text-xs md:text-sm">
              <span style={{ color: `${C.teal}60` }}>▸</span>
              <span style={{ color: C.textBright }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="tile tile-pane" style={{ ["--tile-accent" as string]: C.purple }}>
        <p className="tile-section-label" style={{ color: C.labelPurple }}>// GENERATED CONTENT</p>
        <h3 className="tile-title mb-3" style={{ color: C.purple }}>Generated Content</h3>
        <p className="tile-text">
          Applications generated by Singularity Engine are created autonomously by AI. The maintainers
          do not review, endorse, or take responsibility for the content,
          functionality, or safety of generated applications.
        </p>
      </div>
      <div className="tile tile-pane" style={{ ["--tile-accent" as string]: C.green }}>
        <p className="tile-section-label" style={{ color: C.label }}>// THIRD-PARTY</p>
        <h3 className="tile-title mb-3" style={{ color: C.green }}>Third-Party Services</h3>
        <p className="tile-text">
          Singularity Engine uses third-party services including Amazon Web Services (AWS), GitHub,
          X (Twitter), and Anthropic (Claude). Your use is also subject to the
          terms of service of these providers.
        </p>
        <p className="tile-text mt-3">
          Open source under the{" "}
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" style={{ color: C.teal }} className="hover:opacity-80">MIT License</a>.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<TabId>(0)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 4) {
          e.preventDefault()
          setTab((num - 1) as TabId)
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="wm-root">
      <PolyBG />
      <div className="wm-shell">
        {/* Title bar */}
        <div className="wm-titlebar">
          <div className="wm-titlebar-dots">
            <div className="wm-dot wm-dot-red" />
            <div className="wm-dot wm-dot-yellow" />
            <div className="wm-dot wm-dot-green" />
          </div>
          <span className="wm-title" style={{ color: C.green }}>SINGULARITY ENGINE</span>
          <span className="wm-title-sub" style={{ color: C.dim }}>v0.1 beta — tweet it. build it. ship it.</span>
        </div>

        {/* Tab bar */}
        <div className="tab-bar">
          {TAB_LABELS.map((label, i) => (
            <button key={label} className={`tab-item ${tab === i ? "tab-active" : ""}`}
              onClick={() => setTab(i as TabId)}>
              <span className="tab-label">{label}</span>
              <span className="tab-shortcut">⌘{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="wm-content">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }} style={{ height: "100%" }}>
              {tab === 0 && <EngineTab />}
              {tab === 1 && <BuildsTab />}
              {tab === 2 && <RoadmapTab />}
              {tab === 3 && <LegalTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="wm-statusbar">
          <span style={{ color: C.green }}>● online</span>
          <span style={{ color: C.dim }}>singularityengine.ai</span>
          <span style={{ color: C.dim }}>AWS Lambda + Claude Sonnet</span>
          <span className="ml-auto" style={{ color: C.dim }}>metatransformer.com</span>
        </div>
      </div>
    </div>
  )
}
