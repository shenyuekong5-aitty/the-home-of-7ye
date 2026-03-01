// 导入 ESLint 官方基础规则包（提供 eslint:recommended 核心规则）
import eslint from "@eslint/js";

// 导入 Vue 专属 ESLint 插件（提供 Vue 模板/脚本的检查规则）
import vuePlugin from "eslint-plugin-vue";

// 导入 TypeScript ESLint 工具集（包含 TS 解析器和检查规则）
import tsPlugin from "typescript-eslint";

// 导入 Vue 文件解析器（核心：先解析 .vue 文件的结构，再交给 TS 解析器处理脚本）
import vueParser from "vue-eslint-parser";

// 导入 Prettier 插件（将 Prettier 格式规则集成到 ESLint 中）
import prettierPlugin from "eslint-plugin-prettier";

// 导入 Prettier 冲突规则关闭包（关闭所有和 Prettier 冲突的 ESLint 格式规则）
import eslintConfigPrettier from "eslint-config-prettier";

// 导入全局变量声明包（快速定义浏览器/Node 等环境的全局变量，避免 ESLint 误报未定义）
import globals from "globals";

// ESLint Flat Config 核心导出（数组格式，支持多配置块组合）
export default [
  // 配置块 1：忽略文件规则（替代传统的 .eslintignore 文件）
  {
    // 指定无需进行 ESLint 检查的文件/目录
    ignores: [
      "node_modules/", // 第三方依赖目录（无需检查）
      "dist/", // 项目打包产物（无需检查）
      "public/", // 静态资源目录（无需检查）
    ],
  },

  // 配置块 2：Vue+TS 核心检查规则（作用于指定文件）
  {
    // 指定当前配置块作用的文件范围（JS/TS/Vue 文件）
    // 注意：原配置的 `'/.js'` 是笔误，修正为 `'**/*.js'` 才是「所有目录下的 .js 文件」
    files: ["**/*.js", "**/*.ts", "**/*.vue"],

    // 语言解析相关配置（核心：指定解析器、版本、全局变量）
    languageOptions: {
      ecmaVersion: "latest", // 支持最新 ES 语法版本（自动兼容 ES6+）
      sourceType: "module", // 代码使用 ES 模块规范（import/export，适配 Vite 项目）
      parser: vueParser, // 主解析器：解析 .vue 文件的模板/脚本结构
      parserOptions: {
        parser: tsPlugin.parser, // 嵌套解析器：将 .vue 文件中 <script> 里的 TS 交给 TS 解析器处理
        extraFileExtensions: [".vue"], // 额外支持解析 .vue 后缀文件
      },
      // 全局变量声明（避免 ESLint 误报「未定义变量」）
      globals: {
        ...globals.browser, // 浏览器环境全局变量（window/document 等）
        ...globals.node, // Node 环境全局变量（process/__dirname 等）
        ...globals.es2021, // ES2021 语法全局变量（Promise.any 等）
        // Vue3 <script setup> 语法全局变量（只读，避免误报修改）
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
      },
    },

    // 注册启用的 ESLint 插件（key 为插件别名，value 为插件本体）
    plugins: {
      vue: vuePlugin, // 注册 Vue 插件（提供 Vue 语法检查规则）
      "@typescript-eslint": tsPlugin.plugin, // 注册 TS 插件（提供 TS 语法检查规则）
      prettier: prettierPlugin, // 注册 Prettier 插件（提供格式检查规则）
    },

    // 自定义规则集（优先级：自定义 > 继承的规则）
    rules: {
      // 继承 ESLint 官方推荐的基础规则（如禁止未声明变量、死代码）
      ...eslint.configs.recommended.rules,
      // 继承 Vue 插件的 Flat 版推荐规则（适配 ESLint 9+/10+）
      ...vuePlugin.configs["flat/recommended"].rules,
      // 继承 TS 插件的推荐规则（tsPlugin.configs.recommended 是数组，取第二个元素的 rules）
      ...tsPlugin.configs.recommended[1].rules,

      // ---------- 自定义基础 JS 规则 ----------
      "no-var": "error", // 禁止使用 var 声明变量（强制用 let/const）

      // ---------- 自定义 Vue 规则 ----------
      "vue/multi-word-component-names": "off", // 关闭「组件名必须多单词」校验（新手友好）

      // ---------- 关闭 Prettier 冲突规则 ----------
      ...eslintConfigPrettier.rules, // 覆盖所有和 Prettier 冲突的 ESLint 格式规则

      // ---------- Prettier 格式规则 ----------
      "prettier/prettier": [
        "warn",
        {
          // 格式问题标记为警告（不阻断构建）
          singleQuote: true, // 强制使用单引号（替代双引号）
          semi: false, // 语句结尾不加分号
          trailingComma: "none", // 数组/对象最后一个元素不加逗号
        },
      ],
    },
  },
];
