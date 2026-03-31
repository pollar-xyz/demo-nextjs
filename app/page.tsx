import Link from 'next/link';

const PAGES = [
  { href: '/transactions', label: 'Transactions', desc: 'Invoke smart contracts and build Stellar operations.' },
  { href: '/balance',      label: 'Balance',      desc: 'Fetch Stellar account balances by public key.'       },
  { href: '/ramp',         label: 'Ramp',         desc: 'Buy and sell crypto with local payment methods.'     },
  { href: '/kyc',          label: 'KYC',          desc: 'Verify your identity to unlock higher limits.'       },
];

export default function Home() {
  return (
    <div className="w-full max-w-sm space-y-3">
      {PAGES.map(({ href, label, desc }) => (
        <Link
          key={href}
          href={href}
          className="block rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
        </Link>
      ))}
    </div>
  );
}