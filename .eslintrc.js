module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "@vue/standard"],

  parserOptions: {
    parser: "babel-eslint"
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    semi: [2, "always"],
    quotes: [2, "double", { avoidEscape: true }],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "ignore",
        named: "ignore",
        asyncArrow: "ignore"
      }
    ]
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
