import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\.(e2e-spec|int-spec)\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/apps/welfare-frontend/.next'],
  testPathIgnorePatterns: ['<rootDir>/apps/welfare-frontend/.next'],
};

export default config;
