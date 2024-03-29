module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    // testRegex: "__tests__/parseAndPrint-test.ts$",
    testPathIgnorePatterns: ["/dist/", "/node_modules/"],
    coveragePathIgnorePatterns: [ "dist" ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
};
