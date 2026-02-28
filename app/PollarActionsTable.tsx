import { usePollar } from '@pollar/react';
import { useState } from 'react';

const btn = 'underline underline-offset-2 hover:text-zinc-500';
const input = 'rounded border border-zinc-300 dark:border-zinc-600 bg-transparent px-2 py-0.5 outline-none focus:border-zinc-500';

export const PollarActionsTable = () => {
  const {
    getBalance,
    buildTx,
    openLoginModal,
    openTransactionModal,
    login,
    logout,
    submitTx,
    sendTransaction,
  } = usePollar();
  const [ balance, setBalance ] = useState<number | null>(null);
  const [ toAddress, setToAddress ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ signedXdr, setSignedXdr ] = useState('');
  const [ submitResult, setSubmitResult ] = useState<string | null>(null);

  const sep = 'border-t border-zinc-200 dark:border-zinc-700';
  const sepBold = 'border-t-2 border-zinc-400 dark:border-zinc-500';
  const cell = 'px-3 py-1.5';

  return (
    <table className="text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
      <thead>
      <tr className="bg-zinc-100 dark:bg-zinc-800 text-left">
        <th className={`${cell} font-semibold`}>action</th>
        <th className={`${cell} font-semibold`}>params</th>
        <th className={`${cell} font-semibold`}>result</th>
      </tr>
      </thead>
      <tbody>

      {/* — auth — */}
      <tr className={sep}>
        <td className={cell}>login</td>
        <td className={cell}>
          <div className="flex items-center gap-2">
            <button className={btn} onClick={() => login({ provider: 'google' })}>google</button>
            <span className="text-zinc-400">|</span>
            <button className={btn} onClick={() => login({ provider: 'github' })}>github</button>
          </div>
        </td>
        <td className={cell}>—</td>
      </tr>
      <tr className={sep}>
        <td className={cell}>logout</td>
        <td className={cell}>
          <button className={btn} onClick={() => logout()}>run</button>
        </td>
        <td className={cell}>—</td>
      </tr>

      {/* — modals — */}
      <tr className={sepBold}>
        <td className={cell}>openLoginModal</td>
        <td className={cell}>
          <button className={btn} onClick={() => openLoginModal()}>run</button>
        </td>
        <td className={cell}>—</td>
      </tr>
      <tr className={sep}>
        <td className={cell}>openTransactionModal</td>
        <td className={cell}>
          <button className={btn} onClick={() => openTransactionModal()}>run</button>
        </td>
        <td className={cell}>—</td>
      </tr>

      {/* — tx — */}
      <tr className={sepBold}>
        <td className={cell}>sendTransaction - payment</td>
        <td className={cell}>
          <div className="flex items-center gap-2">
            <input
              className={`w-48 ${input}`}
              placeholder="wallet address"
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
            />
            <input
              className={`w-20 ${input}`}
              placeholder="amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button
              className={btn}
              onClick={() => sendTransaction('payment', {
                destination: toAddress,
                amount,
                asset: { type: 'native' },
              })}
            >run
            </button>
          </div>
        </td>
        <td className={cell}>—</td>
      </tr>
      <tr className={sep}>
        <td className={cell}>buildTx - payment</td>
        <td className={cell}>
          <div className="flex items-center gap-2">
            <input
              className={`w-48 ${input}`}
              placeholder="wallet address"
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
            />
            <input
              className={`w-20 ${input}`}
              placeholder="amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button
              className={btn}
              onClick={async () => buildTx('payment', {
                destination: toAddress,
                amount,
                asset: { type: 'native' },
              })}
            >run
            </button>
          </div>
        </td>
        <td className={cell}>—</td>
      </tr>
      <tr className={sep}>
        <td className={cell}>submitTx</td>
        <td className={cell}>
          <div className="flex items-center gap-2">
            <input
              className={`w-64 ${input}`}
              placeholder="signed XDR"
              value={signedXdr}
              onChange={e => setSignedXdr(e.target.value)}
            />
            <button
              className={btn}
              onClick={async () => setSubmitResult(JSON.stringify(await submitTx(signedXdr)))}
            >run
            </button>
          </div>
        </td>
        <td className={cell}>{submitResult ?? '—'}</td>
      </tr>
      <tr className={sep}>
        <td className={cell}>getBalance</td>
        <td className={cell}>
          <button className={btn} onClick={async () => setBalance(await getBalance())}>run</button>
        </td>
        <td className={cell}>{JSON.stringify(balance) ?? '—'}</td>
      </tr>

      </tbody>
    </table>
  );
};
