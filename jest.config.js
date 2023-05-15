module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '^(?=.*protocol).*',
    'domain',
    'server.ts',
    'env.ts',
    'infra/http/requests'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 85,
      statements: -5
    }
  }
}
