'use client';

import { usePollar, KycStatus } from '@pollar/react';
import type { KycStatus as KycStatusValue } from '@pollar/core';
import { useState } from 'react';

export default function KycPage() {
  const { openKycModal, isAuthenticated } = usePollar();
  const [status, setStatus] = useState<KycStatusValue>('none');

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div>
        <h1 className="text-sm font-semibold">KYC</h1>
        <p className="text-xs text-zinc-500 mt-1">Verify your identity to unlock higher limits and regulated features.</p>
      </div>
      <KycStatus status={status} />
      <button
        onClick={() => openKycModal({ country: 'MX', level: 'basic', onApproved: () => setStatus('approved') })}
        disabled={!isAuthenticated}
        className="w-full sm:w-auto rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        {isAuthenticated ? 'Start KYC' : 'Connect wallet first'}
      </button>
    </div>
  );
}
