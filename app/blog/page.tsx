import Link from 'next/link';

export const metadata = {
  title: "Anna's Notebook",
  description: 'Personal notes and short essays',
};

const posts = [
  { date: 'November 1, 2025', title: 'PROVA1234', href: '/blog/04-about-time' },
  { date: 'October 21, 2025', title: 'GAY', href: '/blog/03-about-spending' },
];

export default function BlogPage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20 text-white min-h-screen"> 
      <h1 className="text-4xl font-extrabold mb-12">Anna's Notebook</h1>

      {/* Lista post con date allineate */}
      <div className="space-y-3">
        {posts.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex items-baseline cursor-pointer hover:text-link-hover transition duration-200"
          >
            {/* Colonna sinistra: data */}
            <span className="w-40 text-neutral-500 dark:text-neutral-400 italic shrink-0">
              {p.date}
            </span>

            {/* Colonna destra: titolo */}
            <span className="text-neutral-900 dark:text-neutral-100 group-hover:underline underline-offset-4">
              {p.title}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
