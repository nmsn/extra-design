// 引入插件
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import less from "less";
// 入口文件
const entry = "src/index.tsx";

// babel配置
const babelOptions = {
  presets: ["@babel/preset-env"],
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  exclude: "**/node_modules/**",
};

// rollup配置
export default {
  // 入口
  input: entry,
  // 打包信息
  output: [{ filename: "index.esm.js", dir: "dist/es/", format: "esm" }],
  // 插件配置
  plugins: [
   
    postcss({
      // minimize: true,
      // modules: true,
      use: {
        sass: null,
        stylus: null,
        less: { javascriptEnabled: true },
      },
      extract: true,
    }),
     // 可使用 `import {module} from './file'` 替换 `import {module} from './file/index.js`
     resolve(),

    
    // 支持commonjs，包括第三方引入使用到commonjs语法
    commonjs(),
    // typescript支持
    typescript(),

    // babel
    babel(babelOptions),
  ],
};
