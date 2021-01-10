const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";

module.exports = {
  testRegex: TEST_REGEX,
  collectCoverageFrom: [
    "<rootDir>/utils/**/*.ts",
    "<rootDir>/pcap/**/*.ts",
    "<rootDir>/msg_broker/**/*.ts",
    "!<rootDir>/utils/**/*.d.ts",
    "!<rootDir>/utils/api/*.ts",
    "!<rootDir>/utils/example.ts",
    "!<rootDir>/utils/Error/*"
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/built/", "<rootDir>/node_modules/", "<rootDir>/utils/api/", "<rootDir>/utils/example.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
}
