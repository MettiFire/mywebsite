"use client";
import { useEffect } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";
import TimestampLink from "@/components/TimestampLink";
import ViewCounter from "@/components/ViewCounter";
import Link from "next/link";

export default function PostContent() {
  useEffect(() => {
    fetch(`/api/views/01-try`, { method: "POST" });
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

      {/* Title */}
      <h1 className="text-3xl font-semibold tracking-tight my-0 mb-2 text-neutral-900 dark:text-neutral-100">
        My favorite solos
      </h1>

      {/* Date */}
      <p className="text-neutral-600 dark:text-neutral-400 italic mb-10 opacity-70">
        November 24, 2025 • <ViewCounter slug="01-try" />
      </p>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Today I want to share some of my all-time favorite solos.
          I've listened to them millions of times, and each time they leave something with me.
        </p>

        <h2>1. Night Trouble — Petit Biscuit</h2>

        <p>
          At minute <TimestampLink time="1:23" playerId="night-trouble" />, one of my favorite moments begins: a crescendo that feels suspended.
        </p>

        <YouTubePlayer
          videoId="HxfE6PJmGS8"
          title="Night Trouble - Petit Biscuit"
          playerId="night-trouble"
        />

        <p>The piece opens delicately and then explodes into a world of its own.</p>

        <h2>2. Lover, You Should've Come Over — Jeff Buckley</h2>

        <p>
          The moment I love is at minute <TimestampLink time="3:41" playerId="jeff-buckley" />, where Buckley seems to be singing from another dimension.
        </p>

        <YouTubePlayer
          videoId="HxfE6PJmGS8"
          title="Lover, You Should've Come Over - Jeff Buckley"
          playerId="jeff-buckley"
        />

        <p>It's a song that digs deep inside you.</p>
      </article>
    </main>
  );
}
