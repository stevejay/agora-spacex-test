import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

export interface AllTheProvidersProps {
  /** The children that are rendered by RTL. */
  children: ReactNode;
}

export function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const customRender = (
  ui: ReactElement,
  wrapperOptions?: Omit<AllTheProvidersProps, 'children'>,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: (props) => <AllTheProviders {...wrapperOptions} {...props} />, ...options });

// eslint-disable-next-line import/export
export * from '@testing-library/react';

// eslint-disable-next-line import/export
export { customRender as render };
