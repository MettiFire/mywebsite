import Link from 'next/link';
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata = {
  title: "Anna's Gioiellini",
  description: 'Personal notes and short essays',
};

const posts = [
  { date: 'July 10, 2025', title: 'prova articolo', href: '/music/posts/it/01-try' },
];

export default function BlogPage() {
  return (
    <main className="max-w-[670px] mx-auto px-6 py-20">
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Anna's <span className="italic">Gioiellini</span>
      </h1>
    

      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        My love for music comes entirely from my dad. Since I was little, he’s fed me song after song, quizzing me on singers, bands, guitarists. He’d burst into my room saying <strong><em>"Te l'ho insegnata questa?"</em></strong> (“Have I taught you this one?”), and at my “No…” he’d smile like he was about to open a secret door — and honestly, it always felt like that.
        <br/><br/>
        The name of this section — <strong><em>Gioiellini</em></strong>, “little gems” — comes from him too, from one of his legendary playlists where he saves all the songs he considers treasures.
        <br/><br/>
        So here’s where I try to pass on those lucky teachings, in my own voice. As my friends know well, whenever one of “my” songs plays, I <em>cannot</em> resist explaining it — <em>“hear that sax coming in”</em>, <em>“here it picks up”</em>, <em>“wait for this rhythm change”</em> — all the tiny details that make it sparkle.
      </p>

      

      <div className="flex justify-end mb-6">
        <LanguageSwitcher current="it" />
      </div>
            
      <table className="w-full border-separate table-fixed" style={{ borderSpacing: '0 0.5rem' }}>
        <colgroup>
          <col style={{ width: '201.57px' }} />
          <col />
        </colgroup>
        <tbody>
          {posts.map((post) => (
            <tr key={post.href}>
              <td className="text-neutral-600 dark:text-neutral-400 italic tabular-nums pr-8 align-baseline whitespace-nowrap opacity-70 ">
                {post.date}
              </td>
              <td className="align-baseline">
                <Link
                  href={post.href}
                  className="text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4"
                >
                  {post.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      
      
    </main>
  );
}