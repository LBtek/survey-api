module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '^(?=.*protocol).*',
    'main/config',
    'domain/usecases',
    'domain/value-objects',
    '/entities/',
    '/models/',
    '/docs/',
    'server.ts',
    'env.ts',
    'infra/http/requests',
    '.d.ts$'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '#/(.*)': '<rootDir>/tests/$1'
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
