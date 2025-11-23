"use client";

interface TimestampLinkProps {
  time: string; // formato "1:23"
  playerId: string; // deve corrispondere al playerId del YouTubePlayer
}

function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export default function TimestampLink({ time, playerId }: TimestampLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const seconds = timeToSeconds(time);
    
    // Invia messaggio al player per andare al timestamp
    window.postMessage({
      type: 'seekTo',
      playerId: playerId,
      time: seconds
    }, '*');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer font-mono text-sm"
    >
      {time}
    </button>
  );
}
