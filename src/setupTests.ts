import chai from 'chai';
import { afterEach } from 'vitest';

import { cleanup } from '@/testUtils';

// import { server } from './mocks/server.js';

// Extend chai with chai-dom assertions
// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require('chai-dom'));

// React Testing Library cleanup
afterEach(cleanup);

// // Establish API mocking before all tests.
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// // Reset any request handlers that we may add during the tests,
// // so they don't affect other tests.
// afterEach(() => server.resetHandlers());
// // Clean up after the tests are finished.
// afterAll(() => server.close());
