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
          <h1 className="text-4xl font-bold text-text-primary mb-6">Hi, I’m Anna.</h1>

          <p className="text-lg text-text-primary">
            I grew up in <a href="https://en.wikipedia.org/wiki/Brescia" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Brescia</a>, and these days I spend most of my time at <a href="https://necst.it/" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">NECSTLab</a>, studying for my <a href="https://www.polimi.it/en/education/laurea-magistrale-programmes/programme-detail/computer-science-and-engineering" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Master’s in Computer Science and Engineering</a> at <a href="https://www.polimi.it/en/" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Politecnico di Milano</a> and working as a Software Development Engineer at <a href="https://sensia.bio" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Sensia</a>. A lot of what I do ends up somewhere between code and visual design: building something, figuring out how it should work, then spending a little too long deciding how it should look. Lately, I’ve been getting into application security, especially where it meets UI and UX design.
          </p>

          <p className="text-lg text-text-primary mt-4">
            This website is part of that. Some of my <a href="/projects" className="underline underline-offset-4 hover:text-link-hover">projects</a> start with something I want to use myself; others are an excuse to try something I haven’t done before. I keep them here, alongside <a href="/blog" className="underline underline-offset-4 hover:text-link-hover">writing</a>, <a href="/music" className="underline underline-offset-4 hover:text-link-hover">music</a> and <a href="https://silvae.lovable.app/u/mettignis" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-link-hover">the books I’m reading</a>.
          </p>

          <p className="text-lg text-text-primary mt-4">
            Away from the screen, there’s always some kind of movement. Sports are basically my default mode: when time management behaves, I log around 10 hours of training a week across pretty much any discipline. I’m a karate black belt, currently working on becoming a coach while competing nationally. I’ve checked off a couple of Spartan races and a HYROX relay, and my endurance bucket list keeps growing, from a half marathon and a full marathon to the distant, crazy goal of an <a href="https://en.wikipedia.org/wiki/Ironman_Triathlon" target="_blank" rel="noopener noreferrer" className="no-underline italic hover:text-link-hover">Ironman</a>.
          </p>

          <p className="text-lg text-text-primary mt-4">
            And sometimes I just want to nerd out over anime, manga, or a Souls game I’ve already died in far too many times.
          </p>

          <p className="text-lg text-text-primary mt-4">
            There’s a guitar in the picture too. I play with friends, and an evening spent making music together is still one of my favourite ways to lose track of time.
          </p>

          <p className="opacity-70 italic text-lg text-text-primary mt-4">
            <ViewCounter slug="home" />
          </p>
        </div>
      </main>
    </div>
  );
}
