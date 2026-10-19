import MusicContent from './MusicContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Anna's Gioiellini",
  description: 'Musical gems that have touched my soul.',
};

export default function MusicPage() {
  return <MusicContent />;
}
