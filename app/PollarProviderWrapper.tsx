'use client';

import { PollarProvider } from '@pollar/react';
import { useSearchParams } from 'next/navigation';

const DEFAULT_API_KEY = 'cmm2qa4d30001gkid7myxvd1v';
// const BASE_URL = 'https://sdk.api.local.pollar.xyz';

export const PollarProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey') ?? DEFAULT_API_KEY;

  return (
    <PollarProvider config={{ apiKey }}>
      {children}
    </PollarProvider>
  );
};
