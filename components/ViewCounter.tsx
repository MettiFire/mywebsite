"use client";

import React, { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    const sessionKey = `viewed-${slug}`;

    const fetchViews = async () => {
      try {
        let response;
        if (!sessionStorage.getItem(sessionKey)) {
          // Incrementa il contatore solo se non l'abbiamo già fatto in questa sessione
          response = await fetch(`/api/views/${slug}`, { method: "POST" });
          sessionStorage.setItem(sessionKey, "true");
        } else {
          response = await fetch(`/api/views/${slug}`, { method: "GET" });
        }

        const data = await response.json();
        setViews(data.views);
      } catch (err) {
        console.error(err);
        setViews(0); // fallback
      }
    };

    fetchViews();
  }, [slug]);

  if (views === null) return <span>Loading views…</span>;

  return <span>{views} view{views === 1 ? "" : "s"}</span>;
}
