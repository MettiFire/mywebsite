import YouTubePlayer from "@/components/YouTubePlayer";
import TimestampLink from "@/components/TimestampLink";

export const metadata = {
  title: "I miei soli preferiti",
  description: "Una selezione di canzoni con assoli bellissimi.",
};

export default function Post() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">I miei soli preferiti</h1>

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
