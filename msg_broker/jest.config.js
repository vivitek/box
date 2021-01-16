const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";
module.exports = {
  testRegex: TEST_REGEX,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  globals: {
    'ts-jest': {
      tsconfig: '../tsconfig.json'
    }
  },
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/built/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
}