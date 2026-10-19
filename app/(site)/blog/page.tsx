import BlogContent from './BlogContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Anna's Notebook",
  description: 'Thoughts, adventures, reasonings and sentimental moments.',
};

export default function BlogPage() {
  return <BlogContent />;
}