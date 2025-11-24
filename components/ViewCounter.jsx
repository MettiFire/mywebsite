"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    async function fetchViews() {
      // Chiave per tracciare se questa pagina è già stata vista in questa sessione
      const viewedKey = `viewed_${slug}`;
      const hasViewed = sessionStorage.getItem(viewedKey);

      if (!hasViewed) {
        // Prima visita in questa sessione: incrementa
        const res = await fetch(`/api/views/${slug}`, {
          method: "POST",
        });
        const data = await res.json();
        setViews(data.views);
        
        // Segna come vista per questa sessione
        sessionStorage.setItem(viewedKey, "true");
      } else {
        // Già vista in questa sessione: solo fetch senza incrementare
        const res = await fetch(`/api/views/${slug}`, {
          method: "GET",
        });
        const data = await res.json();
        setViews(data.views);
      }
    }

    fetchViews();
  }, [slug]);

  return (
    <span className="text-neutral-600 dark:text-neutral-500 italic">
      {views === null ? "…" : ` ${views} views`}
    </span>
  );
}
