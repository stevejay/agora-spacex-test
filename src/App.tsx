import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LaunchesListingPage } from './components/LaunchesListingPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LaunchesListingPage />
    </QueryClientProvider>
  );
}
