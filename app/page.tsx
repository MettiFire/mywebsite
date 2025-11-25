"use client"
import React from 'react';
import ViewCounter from "@/components/ViewCounter";
import { useEffect } from "react";



export default function Home() {

  useEffect(() => {
    fetch(`/api/views/home`, {
      method: "POST",
    });
  }, []);


  return (
    <div className="flex flex-col pt-40">
      {/* header/footer are provided by the root layout */}

      <main className="flex-1">
        <div className="max-w-[670px] mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-text-primary mb-6">Hi, I’m Anna Mettifogo</h1>

          <p className="text-lg text-text-primary">
            Born and raised in <a href="https://en.wikipedia.org/wiki/Brescia" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Brescia</a>, I’ve always been curious about how things work behind the scenes — whether it’s a computer, a project, or just life in general.
          </p>

          <p className="text-lg text-text-primary mt-4">
            I’m studying <strong>Computer Science and Engineering</strong> at <a href="https://www.polimi.it/en/" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Politecnico di Milano</a>, finishing my <a href="https://www.polimi.it/en/education/laurea-programmes/programme-detail/engineering-of-computing-systems" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Bachelor’s in Engineering of Computing Systems</a> and about to dive into my <a href="https://www.polimi.it/en/education/laurea-magistrale-programmes/programme-detail/computer-science-and-engineering" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Master’s in Computer Science and Engineering</a>.
          </p>

          <p className="text-lg text-text-primary mt-4">
            I’m passionate about <em>UI/UX design</em>, graphics, and all the tiny visual details that shape how we experience the world. Lately, <em>cybersecurity</em> has snuck into my brain too, and I can’t wait to explore it more during my Master’s.
          </p>

          <p className="text-lg text-text-primary mt-4">
            When I’m not buried in books or glued to my computer, you’ll probably find me moving: I’m a <strong>black belt in karate</strong> with over 10 years of practice, and I love how it teaches discipline, focus and resilience — skills that come in handy both in life and in coding.
          </p>

          <p className="text-lg text-text-primary mt-4">
            Sports are basically my second language — from <strong>running</strong> and swimming to <strong>mountain hiking</strong>. Right now I’m training for a <em>half marathon</em>, dreaming about a <em>full marathon</em>, and (someday) an <a href="https://en.wikipedia.org/wiki/Ironman_Triathlon" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Ironman</a>. Because apparently, I like to suffer for fun.
          </p>

          <p className="text-lg text-text-primary mt-4">
            And then there’s music — my personal escape hatch. I play the guitar, hum along, and can spend hours in a jam session with friends, which is honestly one of my favorite ways to spend an evening. 
          </p>

          <p className="text-lg text-text-primary mt-4">
            This website is my little corner to share all of this — my thoughts, projects, books, and a bit of my soul. Feel free to wander around my <a href="/blog" className="underline underline-offset-4 hover:text-link-hover">blog</a>, my <a href="/music" className="underline underline-offset-4 hover:text-link-hover">music</a> and my <a href="/books" className="underline underline-offset-4 hover:text-link-hover">library</a> — maybe you’ll find something that surprises you, makes you smile, or even makes you want to start your own jam session.
          </p>


          <p className="opacity-70 italic text-lg text-text-primary mt-4">
            <ViewCounter slug="home" />
          </p>
        </div>
      </main>
    </div>
  );
}
