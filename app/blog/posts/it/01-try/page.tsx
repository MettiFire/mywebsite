import ViewCounter from "@/components/ViewCounter";

export const metadata = {
  title: "Sullo spendere tempo — Anna’s Notebook",
  description: "Un articolo personale sul tempo e su come lo viviamo.",
};

export default function ArticlePage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20 min-h-screen">

      {/* Titolo */}
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">
        Sullo spendere tempo
      </h1>

      {/* Data */}
      <p className="text-neutral-500 dark:text-neutral-400 italic mb-10 flex items-center gap-2">
        November 1, 2025 
        <ViewCounter slug="01-try" />
      </p>

      {/* Contenuto */}
      <article className="prose prose-neutral dark:prose-invert">
        <p>
          Questo è il contenuto del tuo articolo. Puoi scrivere liberamente in JSX,
          aggiungere paragrafi, liste, immagini o qualsiasi elemento HTML.
        </p>

        <p>
          Se vuoi stili più sofisticati, puoi usare Tailwind su elementi specifici,
          oppure aggiungere un plugin per “prose” più avanzato.
        </p>
      </article>

    </main>
  );
}
