import React from 'react';
import ViewCounter from "@/components/ViewCounter";

export default function Home() {
  return (
    <div className="flex flex-col pt-40">
      {/* header/footer are provided by the root layout */}

      <main className="flex-1">
        <div className="max-w-[670px] mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-text-primary mb-6">Hi, I’m Anna Mettifogo</h1>
          <p className="text-lg text-text-primary">
            Born and raised in <a href="https://en.wikipedia.org/wiki/Brescia" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Brescia</a>, I’ve always loved exploring how things work behind the scenes.
          </p>

          <p className="text-lg text-text-primary mt-4">
            I’m studying <strong>Computer Science and Engineering</strong> at <a href="https://www.polimi.it/en/" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Politecnico di Milano</a>, currently completing my <a href="https://www.polimi.it/en/education/laurea-programmes/programme-detail/engineering-of-computing-systems" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Bachelor’s in Engineering of Computing Systems</a> and starting my <a href="https://www.polimi.it/en/education/laurea-magistrale-programmes/programme-detail/computer-science-and-engineering" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Master’s in Computer Science and Engineering</a>.
          </p>

          <p className="text-lg text-text-primary mt-4">
            I’m passionate about <strong>UI/UX design</strong>, <strong>graphics</strong>, and how visual choices shape perception. Recently, I’ve also developed a strong curiosity for <strong>cybersecurity</strong>, which I plan to explore further during my Master’s.
          </p>

          <p className="text-lg text-text-primary mt-4">
            When I'm not deep in books or in front of my computer, I'm 99% doing sports: I’m a <strong>black belt in karate</strong> with over 10 years of practice, and I love the discipline, focus, and strength it brings.
          </p>

          <p className="text-lg text-text-primary mt-4">
            I love sports of every kind — from <strong>running</strong> and swimming to <strong>mountain hiking</strong>. I’m currently training for a <em>half marathon</em>, aiming one day for a <em>full marathon</em> and an <a href="https://en.wikipedia.org/wiki/Ironman_Triathlon" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Ironman</a>.
          </p>

          <p className="text-lg text-text-primary mt-4">
            This website is my personal space to share my thoughts, projects, and the books I read. Feel free to explore my <a href="/blog" className="underline underline-offset-4 hover:text-link-hover">blog</a> and <a href="/books" className="underline underline-offset-4 hover:text-link-hover">library</a>.
          </p>

          <p className="italic text-lg text-text-primary mt-4">
            <ViewCounter slug="page.tsx" />
          </p>
        </div>
      </main>
    </div>
  );
}
