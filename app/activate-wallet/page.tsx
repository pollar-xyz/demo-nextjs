'use client';

import { clientEnv } from '@/lib/env';
import { useState } from 'react';

type ActivateResult =
  | { ok: true; publicKey: string; amount: number }
  | { ok: false; code: string; status: number };

const ERROR_MESSAGES: Record<string, string> = {
  API_KEY_NOT_FOUND: 'Secret key not found or invalid.',
  API_KEY_TYPE_NOT_ALLOWED: 'This key is a publishable key. You must use a secret key (sec_...).',
  WALLET_NOT_FOUND: 'Wallet not found in the database.',
  FORBIDDEN: 'This wallet does not belong to your application.',
  WALLET_ALREADY_FUNDED: 'This wallet is already active on Stellar.',
  APP_WALLET_NOT_FOUND: 'Your application does not have a funding wallet configured.',
  FUND_XLM_FAILED: 'Failed to send XLM to the wallet. Please try again.',
};

const input =
  'w-full rounded border border-zinc-300 dark:border-zinc-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 font-mono';

export default function ActivateWalletPage() {
  const [ secretKey, setSecretKey ] = useState('');
  const [ confirmed, setConfirmed ] = useState(false);
  const [ publicKey, setPublicKey ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ result, setResult ] = useState<ActivateResult | null>(null);

  function handleConfirmKey() {
    const trimmed = secretKey.trim();
    if (!trimmed) return;
    setConfirmed(true);
    setResult(null);
  }

  async function handleActivate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_API_URL}/v1/wallets/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pollar-api-key': secretKey.trim(),
        },
        body: JSON.stringify({ publicKey: publicKey.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ ok: true, publicKey: data.publicKey, amount: data.amount });
      } else {
        setResult({ ok: false, code: data.error ?? data.code ?? 'UNKNOWN_ERROR', status: res.status });
      }
    } catch {
      setResult({ ok: false, code: 'NETWORK_ERROR', status: 0 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-lg px-6 py-16">

        {/* header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-zinc-400 mb-1">demo / activate-wallet</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Activate KYC-verified wallet
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Simulates the server-side activation step after a user has passed KYC.
          </p>
        </div>

        {/* step 1 — secret key */}
        <section className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold text-zinc-400">STEP 1</span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Enter your secret API key</span>
          </div>

          <div className="rounded border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 mb-4 leading-relaxed">
            <strong>Demo only.</strong> In a real integration you should <strong>never</strong> handle secret keys on
            the
            frontend. This call must be made exclusively from your backend server.
          </div>

          <div className="flex gap-2">
            <input
              className={input}
              type="password"
              placeholder="sec_testnet_xxxx"
              value={secretKey}
              onChange={e => {
                setSecretKey(e.target.value);
                if (confirmed) setConfirmed(false);
                setResult(null);
              }}
              disabled={confirmed}
              onKeyDown={e => e.key === 'Enter' && handleConfirmKey()}
            />
            {confirmed ? (
              <button
                className="shrink-0 rounded border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                onClick={() => {
                  setConfirmed(false);
                  setResult(null);
                }}
              >
                edit
              </button>
            ) : (
              <button
                className="shrink-0 rounded bg-zinc-900 dark:bg-zinc-50 px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40"
                onClick={handleConfirmKey}
                disabled={!secretKey.trim()}
              >
                confirm
              </button>
            )}
          </div>

          {confirmed && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ key set — not persisted, will clear on refresh
            </p>
          )}
        </section>

        {/* step 2 — activate */}
        <section
          className={`rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 transition-opacity ${
            confirmed ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold text-zinc-400">STEP 2</span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Activate wallet</span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Provide the public key of a wallet that has already passed KYC. The server will fund it with XLM on
            Stellar so it becomes active.
          </p>

          <div className="mb-3">
            <label className="block text-xs text-zinc-500 mb-1">Public key (G...)</label>
            <input
              className={input}
              placeholder="GABC...XYZ"
              value={publicKey}
              onChange={e => {
                setPublicKey(e.target.value);
                setResult(null);
              }}
              onKeyDown={e => e.key === 'Enter' && !loading && publicKey.trim() && handleActivate()}
            />
          </div>

          <button
            className="w-full rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40"
            onClick={handleActivate}
            disabled={loading || !publicKey.trim()}
          >
            {loading ? 'Activating…' : 'Activate wallet'}
          </button>

          {/* result */}
          {result && (
            <div
              className={`mt-4 rounded border px-4 py-3 text-xs font-mono ${
                result.ok
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
              }`}
            >
              {result.ok ? (
                <>
                  <p className="font-semibold mb-1">✓ Wallet activated</p>
                  <p>publicKey: {result.publicKey}</p>
                  <p>amount funded: {result.amount} XLM</p>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-1">
                    ✕ {result.code}
                    {result.status > 0 && (
                      <span className="ml-2 font-normal text-zinc-400">HTTP {result.status}</span>
                    )}
                  </p>
                  <p>{ERROR_MESSAGES[result.code] ?? 'An unexpected error occurred.'}</p>
                </>
              )}
            </div>
          )}
        </section>

        {/* endpoint reference */}
        <details className="mt-6 text-xs font-mono text-zinc-400">
          <summary className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 select-none">
            endpoint reference
          </summary>
          <div className="mt-3 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3 space-y-1 leading-relaxed">
            <p>
              <span className="text-zinc-500">POST</span>
              {clientEnv.NEXT_PUBLIC_SERVER_API_URL}/v1/wallets/activate
            </p>
            <p>
              <span className="text-zinc-500">header:</span>
              x-pollar-api-key: sec_testnet_xxxx
            </p>
            <p>
              <span className="text-zinc-500">body:</span>
              {'{ "publicKey": "G..." }'}</p>
            <p className="pt-1 text-zinc-500">200 → {'{ publicKey, amount }'}</p>
            <p className="text-zinc-500">409 WALLET_ALREADY_FUNDED · 404 WALLET_NOT_FOUND · 403 FORBIDDEN</p>
          </div>
        </details>

        <div className="mt-8 text-xs text-zinc-400">
          <a href="/" className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300">
            ← back to main demo
          </a>
        </div>
      </main>
    </div>
  );
}
