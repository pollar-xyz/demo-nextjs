'use client';

import { PollarProvider, WalletButton } from '@pollar/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import '@pollar/react/styles.css';

const DEFAULT_API_KEY = 'pub_testnet_703470595eb6cb72c18651b1455fdc34';
const BASE_URL = 'https://sdk.api.local.pollar.xyz';

const NAV_LINKS = [
  { href: '/transactions', label: 'Transactions' },
  { href: '/balance', label: 'Balance' },
  { href: '/ramp', label: 'Ramp' },
  { href: '/kyc', label: 'KYC' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey') ?? DEFAULT_API_KEY;

  return (
    <PollarProvider config={{ apiKey, baseUrl: BASE_URL }}>
      <nav className="border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6">
        {/* row 1: logo + wallet button */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-sm font-semibold">Pollar</Link>
          <WalletButton />
        </div>
        {/* row 2 (mobile) / inline (desktop) */}
        <div className="flex items-center gap-4 pb-3 sm:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </nav>
      {/* desktop: single row nav */}
      <div className="hidden sm:flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            {label}
          </Link>
        ))}
      </div>
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </PollarProvider>
  );
}
