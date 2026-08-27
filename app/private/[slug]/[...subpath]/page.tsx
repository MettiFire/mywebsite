import type { Metadata } from 'next';
import KarateSite from '../KarateSite';

type PrivateSubpageProps = {
  params: Promise<{ slug: string; subpath: string[] }>;
};

export async function generateMetadata({ params }: PrivateSubpageProps): Promise<Metadata> {
  const { slug, subpath } = await params;

  return {
    title: `${subpath.join(' / ')} | ${slug}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PrivateSubpage({ params }: PrivateSubpageProps) {
  const { slug, subpath } = await params;

  if (slug === 'karate' && subpath.length === 1) {
    const page = subpath[0];
    const validPages = ['chi-siamo', 'corsi', 'galleria', 'contatti'] as const;

    if (validPages.includes(page as (typeof validPages)[number])) {
      return <KarateSite page={page as (typeof validPages)[number]} />;
    }
  }

  const path = subpath.join(' / ');

  return (
    <section className="mx-auto max-w-3xl px-6">
      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Private preview</p>
      <h1 className="text-3xl font-semibold tracking-tight">{slug}</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">Sottopagina: {path}</p>
    </section>
  );
}
