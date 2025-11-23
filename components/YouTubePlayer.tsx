"use client";

import { useRef, useEffect } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  playerId: string; // ID unico per questo player
}

export default function YouTubePlayer({ videoId, title, playerId }: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Listener per i messaggi dai link timestamp
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'seekTo' && event.data.playerId === playerId) {
        const time = event.data.time;
        if (iframeRef.current) {
          // Invia comando al player YouTube per andare al timestamp
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [time, true]
            }),
            '*'
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playerId]);

  return (
    <div className="my-6">
      <iframe
        ref={iframeRef}
        width="100%"
        height="200"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      />
    </div>
  );
}
