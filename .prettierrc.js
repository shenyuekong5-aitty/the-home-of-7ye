// .prettierrc.js
export default {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  printWidth: 120,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'ignore',
  vueIndentScriptAndStyle: true,
  bracketSameLine: false,
  parser: 'typescript', // 默认解析器（对 .ts/.js 有效）

  overrides: [
    {
      files: ['*.md', '*.json'],
      options: {
        printWidth: 80
      }
    },
    // 新增：针对 .vue 文件指定 Vue 解析器
    {
      files: ['*.vue'],
      options: {
        parser: 'vue' // 关键：让 Prettier 使用 Vue 解析器
      }
    }
  ]
}
