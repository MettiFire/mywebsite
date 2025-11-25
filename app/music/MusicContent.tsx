"use client";

import Link from 'next/link';
import { useState } from 'react';

const postsData = {
  it: [
    //{ date: 'November 24, 2025', title: 'I miei soli preferiti', href: '/music/posts/it/01-try' },
    { date: 'TBD', title: 'Work in Progress', href: '/work-in-progress' },
  ],
  en: [
    //{ date: 'November 24, 2025', title: 'My favorite solos', href: '/music/posts/en/01-try' },
    { date: 'TBD', title: 'Work in Progress', href: '/work-in-progress' },
  ]
};

export default function MusicContent() {
  const [currentLang, setCurrentLang] = useState<'it' | 'en'>('it');

  const posts = postsData[currentLang];

  return (
    <main className="max-w-[670px] mx-auto px-6 py-20">
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Anna's <span className="italic">Gioiellini</span>
      </h1>
    

      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        My love for music comes entirely from my dad. Since I was little, he's fed me song after song, quizzing me on singers, bands, guitarists.
        <br/>
        He'd burst into my room saying <strong><em>"Te l'ho insegnata questa?"</em></strong> (<em>"Have I taught you this one?"</em>), and at my <em>"No…"</em> he'd smile like he was about to open a secret door — and honestly, it always felt like that.
        <br/>
      </p>
      <p className="opacity-70 text-[14px]">
        The name of this section — <strong><em>Gioiellini</em></strong>, "little gems" — comes from him too, from one of his legendary playlists where he saves all the songs he considers treasures.
        <br/>
      </p>
      <p>
        So here's where I try to pass on those lucky teachings, in my own voice. As my friends know well, whenever one of "my" songs plays, I <em>cannot</em> resist explaining it — <em>"hear that sax coming in"</em>, <em>"here it picks up"</em> — all the tiny details that make it sparkle.
      </p>

      

      <div className="flex justify-end mb-6">
        <div className="text-[14px] opacity-70">
          <button 
            onClick={() => setCurrentLang('it')}
            className={`bg-transparent border-none p-0 cursor-pointer ${currentLang === "it" ? "underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500 hover:underline underline-offset-4"}`}
          >
            IT
          </button>
          <span className="text-neutral-400 dark:text-neutral-500"> / </span>
          <button
            onClick={() => setCurrentLang('en')}
            className={`bg-transparent border-none p-0 cursor-pointer ${currentLang === "en" ? "underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500 hover:underline underline-offset-4"}`}
          >
            EN
          </button>
        </div>
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
