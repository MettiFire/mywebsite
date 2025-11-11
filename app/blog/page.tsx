import Link from 'next/link';

export const metadata = {
  title: 'Blog - Anna Mettifogo',
  description: 'Notes and essays by Anna Mettifogo',
};

export default function BlogPage() {
  return (
    <div className="max-w-[650px] mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <p className="text-lg text-text-primary mb-6">This is a placeholder for the blog. You can add posts here later.</p>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>Post 1 — coming soon</li>
        <li>Post 2 — coming soon</li>
      </ul>

      <div className="mt-8">
        <Link href="/" className="text-text-secondary hover:text-link-hover">← Back home</Link>
      </div>
    </div>
  );
}
