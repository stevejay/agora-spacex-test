import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';

import { LaunchesSearchPage } from './components/LaunchesSearchPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <LaunchesSearchPage />
      </QueryClientProvider>
    </Provider>
  );
}
