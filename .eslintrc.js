module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "array-bracket-newline": ["error", { multiline: true, minItems: null }],
    "array-bracket-spacing": "error",
    "arrow-spacing": "error",
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "comma-dangle": "error",
    "comma-spacing": "error",
    "comma-style": "error",
    "computed-property-spacing": "error",
    "func-call-spacing": "error",
    "implicit-arrow-linebreak": "off",
    "keyword-spacing": "error",
    "max-len": "off",
    "no-confusing-arrow": "error",
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-duplicate-imports": "error",
    "no-invalid-this": "error",
    "no-lonely-if": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
    "no-return-assign": "error",
    "no-tabs": "error",
    "no-tabs": "error",
    "no-undef": ["error", { typeof: true }],
    "no-unused-expressions": ["error", { allowTernary: true }],
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": "off",
    "object-property-newline": [
      "error",
      { allowAllPropertiesOnSameLine: true }
    ],
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    "semi-spacing": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": "error",
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    camelcase: [
      "error",
      { properties: "never", ignoreDestructuring: true, ignoreImports: true }
    ],
    quotes: ["error", "double", { avoidEscape: true }],
    eqeqeq: "error",
    indent: "off",
    semi: "error"
  }
};
