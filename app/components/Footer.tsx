import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500">
        <div>
          <p className="text-white font-semibold mb-2">Singularity Engine</p>
          <p>The autonomous tweet-to-app pipeline.</p>
          <p className="mt-2">Built by <a href="https://metatransformer.com" className="text-[#00d4ff] hover:underline">Metatransformer</a></p>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Links</p>
          <div className="flex flex-col gap-1">
            <a href="https://singularityengine.ai" className="hover:text-white">singularityengine.ai</a>
            <a href="https://metatransformer.com" className="hover:text-white">metatransformer.com</a>
            <a href="https://x.com/metatransformr" className="hover:text-white">@metatransformr</a>
            <a href="https://discord.gg/clawd" className="hover:text-white">Discord</a>
            <a href="https://github.com/Metatransformer/singularity-engine" className="hover:text-white">GitHub</a>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Legal</p>
          <div className="flex flex-col gap-1">
            <Link href="/legal" className="hover:text-white">Legal & Disclaimer</Link>
            <p className="mt-2 text-xs text-gray-600">MIT License · Provided as-is</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Metatransformer. All rights reserved.
      </div>
    </footer>
  );
}
