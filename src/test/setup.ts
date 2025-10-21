/// <reference types="vitest/globals" />

import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done (e.g. closing database connections, etc.)
afterAll(() => {
  server.close();
});
