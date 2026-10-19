"use client";
import { useEffect } from "react";
import ViewCounter from "@/components/ViewCounter";
import Link from "next/link";
import YouTubePlayer from "@/components/YouTubePlayer";
import TimestampLink from "@/components/TimestampLink";

export default function PostContent() {
  useEffect(() => {
    const hasViewed = sessionStorage.getItem("viewed-01-try");
    if (!hasViewed) {
      fetch(`/api/views/01-try`, { method: "POST" });
      sessionStorage.setItem("viewed-01-try", "true");
    }
  }, []);

  return (
     <main className="max-w-[670px] mx-auto px-6 py-20 min-h-screen">

      {/* Link back */}
      <Link 
        href="/music" 
        className="inline-block mb-4 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors opacity-70"
      >
        ← back
      </Link>

      {/* Titolo */}
      <h1 className="text-3xl font-semibold tracking-tight my-0 mb-2 text-neutral-900 dark:text-neutral-100">
        I miei soli preferiti
      </h1>

      {/* Data */}
      <p className="text-neutral-600 dark:text-neutral-400 italic mb-10 opacity-70">
        November 24, 2025 • <ViewCounter slug="01-try" />
      </p>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oggi voglio condividere alcuni dei miei assoli preferiti di sempre.
        Li ho ascoltati milioni di volte, e ogni volta mi lasciano qualcosa.
      </p>

      <h2>1. Night Trouble — Petit Biscuit</h2>

      <p>
        Al minuto <TimestampLink time="1:23" playerId="night-trouble" /> parte uno dei miei momenti preferiti: un crescendo che sembra sospeso.
      </p>

      <YouTubePlayer
        videoId="HxfE6PJmGS8"
        title="Night Trouble - Petit Biscuit"
        playerId="night-trouble"
      />

      <p>Il pezzo si apre delicato e poi esplode in un mondo tutto suo.</p>

      <h2>2. Lover, You Should've Come Over — Jeff Buckley</h2>

      <p>
        Il punto che amo è al minuto <TimestampLink time="3:41" playerId="jeff-buckley" />, dove Buckley sembra cantare da un'altra dimensione.
      </p>

      <YouTubePlayer
        videoId="HxfE6PJmGS8"
        title="Lover, You Should've Come Over - Jeff Buckley"
        playerId="jeff-buckley"
      />

      <p>È una canzone che ti scava dentro.</p>
      </article>
    </main>
  );
}
