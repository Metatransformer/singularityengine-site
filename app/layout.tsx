import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Singularity Engine — Tweet it. Build it. Ship it.",
  description: "Tweet an app idea → AI builds it in 45 seconds → deploys live → replies with a link. The autonomous tweet-to-app pipeline.",
  keywords: ["AI", "singularity engine", "tweet to app", "autonomous", "Claude", "metatransformer"],
  authors: [{ name: "Metatransformer", url: "https://metatransformer.com" }],
  creator: "Metatransformer",
  openGraph: {
    title: "Singularity Engine — Tweet it. Build it. Ship it.",
    description: "Tweet an app idea → AI builds it in 45 seconds → deploys live → replies with a link.",
    url: "https://singularityengine.ai",
    siteName: "Singularity Engine",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Singularity Engine — Tweet it. Build it. Ship it.",
    description: "Tweet an app idea → AI builds it in 45 seconds → deploys live.",
    creator: "@metatransformr",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
