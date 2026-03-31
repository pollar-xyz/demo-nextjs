'use client';

import { usePollar } from '@pollar/react';
import { useState } from 'react';

const inp = 'w-full rounded border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-zinc-400 placeholder:text-zinc-400';
const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

type Balance = { asset: string; balance: string; assetIssuer?: string };

export default function BalancePage() {
  const { getBalance, walletAddress, isAuthenticated } = usePollar();
  const [publicKey, setPublicKey] = useState('');
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchBalance(key: string) {
    setLoading(true);
    setError(null);
    setBalances(null);
    try {
      const result = await getBalance(key || undefined);
      if (result.success) {
        setBalances(result.balances);
      } else {
        setError(result.errorCode);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-sm font-semibold">Balance</h1>
        <p className="text-xs text-zinc-500 mt-1">Fetch Stellar account balances by public key.</p>
      </div>

      <div className="flex gap-2">
        <input
          className={inp}
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          placeholder={isAuthenticated ? walletAddress || 'G...' : 'G...'}
          spellCheck={false}
        />
        <button
          onClick={() => fetchBalance(publicKey)}
          disabled={loading}
          className={`${btn} shrink-0`}
        >
          {loading ? 'Loading…' : 'Fetch'}
        </button>
      </div>

      {isAuthenticated && (
        <button
          onClick={() => { setPublicKey(''); fetchBalance(''); }}
          disabled={loading}
          className="text-xs font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          Use my wallet
        </button>
      )}

      {error && (
        <p className="text-xs font-mono text-red-500">{error}</p>
      )}

      {balances !== null && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {balances.length === 0 ? (
            <p className="px-4 py-3 text-xs font-mono text-zinc-400">No balances found.</p>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Asset</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((b, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                      {b.asset}
                      {b.assetIssuer && (
                        <span className="block text-[10px] text-zinc-400 truncate max-w-[160px]">{b.assetIssuer}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-zinc-700 dark:text-zinc-300">{b.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
