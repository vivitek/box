const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";

module.exports = {
  testRegex: TEST_REGEX,
  collectCoverageFrom: [
    "<rootDir>/utils/**/*.ts",
    "!<rootDir>/utils/**/*.d.ts",
    "!<rootDir>/utils/api/*.ts",
    "!<rootDir>/utils/example.ts"
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/built/", "<rootDir>/node_modules/", "<rootDir>/msg_broker/src/index.test.ts", "<rootDir>/utils/api/", "<rootDir>/utils/example.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
}
