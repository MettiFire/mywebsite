import Link from 'next/link';

export const metadata = {
  title: "Anna's Library",
  description: 'A selection of books and experiments',
};

export default function BooksPage() {
  return (
    <div className="max-w-[650px] mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Anna's Library</h1>
      <p className="text-lg text-text-primary mb-6">Here are a few books I’m working on or have completed.</p>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li><strong>Project A</strong> — short description.</li>
        <li><strong>Project B</strong> — short description.</li>
      </ul>

      <div className="mt-8">
        <Link href="/" className="text-text-secondary hover:text-link-hover">← Back home</Link>
      </div>
    </div>
  );
}
