import Link from 'next/link';
import { notFound } from 'next/navigation';

// Metadata dinamici per ogni articolo
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  return {
    title: `${article.title} - Anna's Notebook`,
    description: article.excerpt || 'Personal notes and short essays',
  };
}

// Dati degli articoli (in un progetto reale questi verrebbero da un CMS o file markdown)
const articles = [
  {
    slug: '04-about-time',
    title: 'Sullo spendere tempo',
    date: 'November 1, 2025',
    excerpt: 'Riflessioni su come investiamo il nostro tempo.',
    content: `
# Sullo spendere tempo

*November 1, 2025*

Il tempo è la risorsa più preziosa che abbiamo. A differenza del denaro, non può essere guadagnato o risparmiato per dopo.

Ogni momento che passa è un momento che non tornerà mai più. Per questo motivo, è importante essere consapevoli di come scegliamo di spendere il nostro tempo.

## La qualità conta più della quantità

Non si tratta solo di quanto tempo dedichiamo a qualcosa, ma di come lo dedichiamo. Un'ora di concentrazione profonda vale più di tre ore di distrazione continua.

## Conclusione

Investire tempo in ciò che conta davvero è la chiave per una vita significativa.
    `,
  },
  {
    slug: '03-about-spending',
    title: 'Sullo spendere soldi',
    date: 'October 21, 2025',
    excerpt: 'Come il denaro influenza le nostre scelte.',
    content: `
# Sullo spendere soldi

*October 21, 2025*

Il denaro è uno strumento, non un fine. Tuttavia, spesso ci troviamo a spenderlo in modo automatico, senza riflettere sulle nostre vere priorità.

## Spese vs investimenti

C'è una grande differenza tra spendere e investire. Una spesa è un costo che non ritorna, mentre un investimento genera valore nel tempo.

## Minimalismo finanziario

Ridurre le spese superflue non significa privarsi, ma concentrarsi su ciò che porta reale soddisfazione.
    `,
  },
  {
    slug: '02-one-month-eth',
    title: 'Un mese a Zurigo: appunti di vita e probabilità',
    date: 'October 8, 2025',
    excerpt: 'Esperienze e riflessioni da un mese in Svizzera.',
    content: `
# Un mese a Zurigo: appunti di vita e probabilità

*October 8, 2025*

Zurigo è una città che ti costringe a riflettere. Tutto funziona perfettamente, gli orologi sono sempre precisi, e la vita scorre con una regolarità quasi matematica.

## Probabilità e scelte

Durante questo mese ho iniziato a pensare alla vita come a una serie di probabilità. Ogni decisione che prendiamo cambia leggermente le nostre probabilità di successo in un certo campo.

## La cultura del precisione

In Svizzera, la precisione non è solo un valore lavorativo, ma un modo di vivere. Questo ha i suoi pro e contro.

## Conclusioni

Un mese è poco per capire una città, ma abbastanza per iniziare a porsi le domande giuste.
    `,
  },
  {
    slug: '01-polimi-recap',
    title: 'Pensavo fosse amore... invece era il Polimi',
    date: 'July 10, 2025',
    excerpt: 'Riflessioni sulla mia esperienza al Politecnico di Milano.',
    content: `
# Pensavo fosse amore... invece era il Polimi

*July 10, 2025*

Il Politecnico di Milano è un'esperienza che ti cambia. Non solo per quello che impari, ma per come ti costringe a crescere.

## L'intensità degli studi

Le giornate al Polimi sono lunghe e intense. Tra lezioni, esercitazioni e progetti di gruppo, il tempo libero diventa un lusso.

## Le amicizie

Paradossalmente, è proprio in questi momenti di pressione che si creano i legami più forti. Studiare insieme fino a tarda notte crea una complicità unica.

## Guardando indietro

Ora che ho finito, guardo indietro con un misto di nostalgia e sollievo. È stata dura, ma ne è valsa la pena.
    `,
  },
];

// Helper per trovare un articolo per slug
function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

// Genera tutti i percorsi statici (opzionale, per build ottimizzate)
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-[650px] mx-auto px-6 py-20">
      {/* Titolo e Data */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <time className="text-text-secondary italic">{article.date}</time>
      </header>

      {/* Contenuto dell'articolo */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* In un progetto reale, qui renderizzeresti Markdown con un parser come react-markdown */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{
            __html: article.content
              .split('\n')
              .map((line) => {
                if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
                if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
                if (line.startsWith('*') && line.endsWith('*'))
                  return `<p class="text-text-secondary italic">${line.slice(1, -1)}</p>`;
                if (line.trim() === '') return '<br/>';
                return `<p>${line}</p>`;
              })
              .join(''),
          }}
        />
      </div>

      {/* Link per tornare alla lista */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link href="/blog" className="text-text-secondary hover:text-link-hover transition">
          ← Back to all articles
        </Link>
      </footer>
    </article>
  );
}
