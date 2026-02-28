import { usePollar } from '@pollar/react';
import { useState } from 'react';

const statusChar = (s: string) =>
  ({ NONE: '○', LOADING: '◌', SUCCESS: '●', ERROR: '✕' })[s] ?? s;

export const PollarStateTable = () => {
  const { state } = usePollar();
  const [ modal, setModal ] = useState<string | null>(null);

  return (
    <>
      <table className="text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
        <thead>
        <tr className="bg-zinc-100 dark:bg-zinc-800 text-left">
          <th className="px-3 py-1.5 font-semibold">state</th>
          <th className="px-3 py-1.5 font-semibold">status</th>
          <th className="px-3 py-1.5 font-semibold">code</th>
          <th className="px-3 py-1.5 font-semibold">data</th>
        </tr>
        </thead>
        <tbody>
        {[
          { label: 'network', entry: state.network },
          { label: 'authentication', entry: state.authentication },
          { label: 'transaction', entry: state.transaction },
        ].map(({ label, entry }) => (
          <tr key={label} className="border-t border-zinc-200 dark:border-zinc-700">
            <td className="px-3 py-1.5">{label}</td>
            <td className="px-3 py-1.5">{statusChar(entry.status)} {entry.status}</td>
            <td className="px-3 py-1.5 font-semibold">{entry.code}</td>
            <td className="px-3 py-1.5 font-semibold">
              {entry.data != null ? (
                <button
                  className="underline underline-offset-2 hover:text-zinc-500"
                  onClick={() => setModal(JSON.stringify(entry.data, null, 2))}
                >
                  view
                </button>
              ) : '—'}
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {modal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModal(null)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              onClick={() => setModal(null)}
            >
              ✕
            </button>
            <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-all">
              {modal}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};
