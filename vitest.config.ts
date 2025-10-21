/// <reference types="vitest" />
/// <reference types="vite/client" />

import { mergeConfig, defineConfig, type ViteUserConfig } from 'vitest/config';

import commonConfig from './vite.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    define: {
      //   'process.env.__AMP_APP_CONFIG__': `'${JSON.stringify({
      //     API_BASE_URL: 'http://0.0.0.0',
      //     AUTH0: {
      //       DOMAIN: 'test.auth0.com',
      //       CLIENT_ID: '5',
      //       AUDIENCE: 'http://atlas.mp',
      //       ORGANIZATION: 'org_abc',
      //     },
      //     I18N: {
      //       DEFAULT_NS: 'common',
      //       FALLBACK_LNG: 'en',
      //       SUPPORTED_LNGS: 'en,de',
      //     },
      //   })}'`,
      global: 'window',
    },
    test: {
      globals: true,
      testTimeout: 10_000,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      // Run tests in parallel for better performance
      pool: 'threads',
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
      // Reduce isolation overhead for faster tests
      isolate: false,
      // Cache test results for faster re-runs
      cache: {
        dir: 'node_modules/.vitest',
      },
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      coverage: {
        provider: 'istanbul',
        thresholds: {
          statements: 90,
          branches: 85,
          functions: 85,
          lines: 90,
        },
      },
    },
  })
) satisfies ViteUserConfig;
