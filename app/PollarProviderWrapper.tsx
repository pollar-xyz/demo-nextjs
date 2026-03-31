'use client';

import { PollarProvider } from '@pollar/react';
import { useSearchParams } from 'next/navigation';

const DEFAULT_API_KEY = 'pub_testnet_703470595eb6cb72c18651b1455fdc34';
const BASE_URL = 'https://sdk.api.local.pollar.xyz';

export const PollarProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey') ?? DEFAULT_API_KEY;

  return (
    <PollarProvider config={{ apiKey, baseUrl: BASE_URL }}>
      {children}
    </PollarProvider>
  );
};
