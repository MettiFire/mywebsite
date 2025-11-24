import Link from 'next/link';
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata = {
  title: "Anna's Gioiellini",
  description: 'Personal notes and short essays',
};

const posts = [
  { date: 'November 1, 2025', title: 'Sullo spendere tempo', href: '/blog/posts/it/01-teatro' },
  { date: 'July 10, 2025', title: 'Pensavo fosse amore... invece era il Polimi', href: '/music/posts/it/01-try' },
];

export default function BlogPage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20">
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Anna's <span className="italic">Gioiellini</span>
      </h1>
    

      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        All my notes and essays are originally written in Italian, since it's the language
        in which I naturally think and express myself best.  
        English versions are provided for accessibility and for anyone who prefers them.
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