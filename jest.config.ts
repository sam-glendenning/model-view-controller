import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // Module resolution and mocking
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^uuid$': '<rootDir>/src/test/__mocks__/uuid.ts',
    // Handle CSS/asset imports in tests
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/**/__tests__/**/*',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/mocks/**/*', // Exclude mock files
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 37,
      functions: 70,
      lines: 70,
      statements: 69,
    },
  },

  // Performance optimizations
  maxWorkers: '50%', // Use half of available CPU cores
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  // File extensions and transforms
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },

  // Node modules handling
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@mui|@emotion|@tanstack|msw|uuid)/)',
  ],

  // Test environment configuration
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },

  // Timeouts and behavior
  testTimeout: 15000, // Slightly higher for MSW tests
  verbose: false, // Set to true for debugging
  silent: false,

  // Clear mocks between tests for better isolation
  clearMocks: true,
  restoreMocks: true,

  // MSW resolver
  resolver: '<rootDir>/msw-resolver.js',
};

// Use CommonJS export for Jest compatibility
module.exports = config;
