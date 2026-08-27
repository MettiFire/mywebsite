import type { Metadata } from 'next';
import KarateSite from '@/app/private/[slug]/KarateSite';

type PrivatePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PrivatePageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} | Private preview`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PrivatePage({ params }: PrivatePageProps) {
  const { slug } = await params;

  if (slug === 'karate') {
    return <KarateSite page="home" />;
  }

  return (
    <section className="mx-auto max-w-3xl px-6">
      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Private preview</p>
      <h1 className="text-3xl font-semibold tracking-tight">{slug}</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Questa area e raggiungibile solo tramite il suo link diretto.
      </p>
    </section>
  );
}
