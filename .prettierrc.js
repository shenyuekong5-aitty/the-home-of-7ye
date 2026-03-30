// .prettierrc.js（ES 模块写法，适配 "type": "module"）
export default {
  // 基础格式规则
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: false,
  trailingComma: "none",
  printWidth: 120,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "auto",

  // Vue/HTML 专属规则
  htmlWhitespaceSensitivity: "ignore",
  vueIndentScriptAndStyle: true,
  bracketSameLine: false,

  // TS/JS 解析器
  parser: "typescript",

  // 覆盖规则（可选）
  overrides: [
    {
      files: ["*.md", "*.json"],
      options: {
        printWidth: 80,
      },
    },
  ],
};