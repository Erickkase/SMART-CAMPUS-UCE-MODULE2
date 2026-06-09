import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(spec|int-spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  collectCoverageFrom: ['apps/**/*.ts', '!apps/**/*.module.ts', '!apps/**/main.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/apps/welfare-frontend/.next'],
  testPathIgnorePatterns: ['<rootDir>/apps/welfare-frontend/.next'],
};

export default config;
