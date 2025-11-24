"use client";

import Link from 'next/link';
import { useState } from 'react';

const postsData = {
  it: [
    { date: 'November 24, 2025', title: 'Merda merda merda!', href: '/blog/posts/it/01-teatro' },
  ],
  en: [
    { date: 'November 24, 2025', title: 'Merda merda merda! / Break a Leg!', href: '/blog/posts/en/01-teatro' },
  ]
};

export default function BlogPage() {
  const [currentLang, setCurrentLang] = useState<'it' | 'en'>('it');

  const posts = postsData[currentLang];

  return (
    <main className="max-w-[670px] mx-auto px-6 py-20">
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100">
        Anna's Notebook
      </h1>
    

      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        This is my space to put down thoughts, share an adventure or two, indulge in <em>strange</em> reasonings, and express the sentimental side that occasionally overwhelms me. 
        <br />
        Here, you'll find everything that crosses my mind.
        <br /><br />
        All writing originates in Italian, my native language. English translations are always available for a more comfortable and accessible read.
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
          <col style={{ width: '210.58px' }} />
          <col />
        </colgroup>
        <tbody>
          {posts.map((post) => (
            <tr key={post.href}>
              <td className="text-neutral-600 dark:text-neutral-400 italic tabular-nums pr-8 align-baseline whitespace-nowrap w-40 opacity-70">
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