import Link from 'next/link';

export const metadata = {
  title: "Anna's Notebook",
  description: 'Personal notes and short essays',
};

const posts = [
  { date: 'November 1, 2025', title: 'Sullo spendere tempo', href: '/blog/04-about-time' },
  { date: 'October 21, 2025', title: 'Sullo spendere soldi', href: '/blog/03-about-spending' },
  { date: 'October 8, 2025', title: 'Un mese a Zurigo: appunti di vita', href: '/blog/02-one-month-eth' },
  { date: 'July 10, 2025', title: 'Pensavo fosse amore... invece era il Polimi', href: '/blog/01-try' },
];

export default function BlogPage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20 min-h-screen">
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Anna's Notebook
      </h1>

      <div>
        {posts.map((post) => (
          <div
            key={post.href}
            // Contenitore: colonna su mobile, riga su desktop
            className="w-full flex flex-col sm:flex-row sm:space-x-2 mb-4"
          >
            {/* 2. La Data (con classi aggiornate) */}
            <p 
              className="text-neutral-600 dark:text-neutral-400 w-full sm:w-[140px] sm:flex-shrink-0 tabular-nums"
            >
              {post.date}
            </p>
            
            {/* 3. Il Titolo (con classi aggiornate) */}
            <Link
              href={post.href}
              className="text-neutral-900 dark:text-neutral-100 tracking-tight hover:underline underline-offset-4 w-full sm:flex-1 text-red-500"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </div>
      
    </main>
  );
}