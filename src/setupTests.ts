import { QueryCache } from '@tanstack/react-query';
import chai from 'chai';
import { fetch } from 'cross-fetch';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/mocks/server';
import { cleanup } from '@/testUtils';

// Add `fetch` polyfill for msw.
global.fetch = fetch;

// Extend chai with chai-dom assertions
// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require('chai-dom'));

// Ensure React Testing Library cleanup.
afterEach(cleanup);

// Establish msw API mocking before all tests.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
// Reset any msw request handlers that we may add during the tests, so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up msw after the tests are finished.
afterAll(() => server.close());

// Clean up any cached responses from react-query after each test.
const queryCache = new QueryCache();
afterEach(() => {
  queryCache.clear();
});
