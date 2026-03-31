'use client';

import { usePollar } from '@pollar/react';

export default function RampPage() {
  const { openRampWidget, isAuthenticated } = usePollar();

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div>
        <h1 className="text-sm font-semibold">Ramp</h1>
        <p className="text-xs text-zinc-500 mt-1">Buy and sell crypto with local payment methods (SPEI, PIX, PSE, ACH).</p>
      </div>
      <button
        onClick={openRampWidget}
        disabled={!isAuthenticated}
        className="w-full sm:w-auto rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 disabled:opacity-40 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
      >
        {isAuthenticated ? 'Open Ramp Widget' : 'Connect wallet first'}
      </button>
    </div>
  );
}
