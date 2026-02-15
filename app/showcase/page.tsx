"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Build, BuildCard } from "../components/BuildCard";

const API = "https://8mag3jdi5f.execute-api.us-east-1.amazonaws.com/api/builds";

export default function Showcase() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchBuilds = useCallback(async (p: number, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?per_page=12&page=${p}&sort=coolness`);
      const data = await res.json();
      const items: Build[] = Array.isArray(data) ? data : data.builds || [];
      if (items.length < 12) setHasMore(false);
      setBuilds((prev) => (reset ? items : [...prev, ...items]));
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBuilds(1, true);
  }, [fetchBuilds]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => {
            const next = p + 1;
            fetchBuilds(next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchBuilds]);

  const filtered = builds.filter((b) => {
    if (minScore > 0 && b.score < minScore) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.query.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Showcase</h1>
        <p className="text-gray-400 mb-8">Every app ever built by Singularity Engine</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search builds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 w-64"
          />
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50"
          >
            <option value={0}>All scores</option>
            <option value={5}>5+ score</option>
            <option value={7}>7+ score</option>
            <option value={9}>9+ score</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b, i) => (
            <BuildCard key={b.id} build={b} index={i} />
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-12">No builds found</p>
        )}

        <div ref={loaderRef} className="py-8 text-center">
          {loading && <span className="text-gray-500 text-sm">Loading...</span>}
        </div>
      </div>
    </div>
  );
}
