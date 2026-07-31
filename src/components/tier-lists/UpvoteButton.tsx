'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@/components/tier-home/primitives';

interface UpvoteButtonProps {
  tierListId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({
  tierListId,
  initialUpvotes,
}: UpvoteButtonProps) {
  const { user, signInWithGoogle } = useAuth();
  const [count, setCount] = useState(initialUpvotes);
  const [voted, setVoted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    if (!user) {
      // Prompt sign-in when not authenticated.
      await signInWithGoogle().catch(() => setError('Falha ao entrar'));
      return;
    }
    if (pending || voted) return;

    setPending(true);
    // Optimistic update, roll back on failure.
    setCount((c) => c + 1);
    setVoted(true);
    try {
      const res = await fetch(`/api/tier-lists/${tierListId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 1 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Falha ao votar');
      }
    } catch (err: unknown) {
      setCount((c) => c - 1);
      setVoted(false);
      setError(err instanceof Error ? err.message : 'Falha ao votar');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || voted}
        aria-pressed={voted}
        className={`tbh-lift inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-70 ${
          voted
            ? 'bg-gold text-black border-gold'
            : 'bg-surface text-ink border-line hover:border-gold hover:text-gold'
        }`}
      >
        <Icon name="thumb_up" className="text-[16px] leading-none" />
        <span>{count}</span>
        <span className="hidden sm:inline">
          {user ? (voted ? 'Votado' : 'Upvote') : 'Entrar p/ votar'}
        </span>
      </button>
      {error && (
        <span className="font-mono text-[10px] text-[#fc2424] uppercase">
          {error}
        </span>
      )}
    </div>
  );
}
