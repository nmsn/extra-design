import clear from 'rollup-plugin-clear';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.tsx",
  output: [
    // {
    //   file: 'es/index.js',
    //   format: 'esm',
    // },
    // {
    //   file: 'lib/index.js',
    //   format: 'cjs',
    // },
    {
      file: "dist/index.js",
      format: "umd",
      name: "@extra-design/components",
    },
  ],
  plugins: [
    clear({
      targets: ['dist', 'lib', 'es'],
    }),
    peerDepsExternal(),
    postcss({
      // minimize: true,
      // modules: true,
      use: {
        less: { javascriptEnabled: true },
      },
      extract: true,
    }),
    typescript(),
    commonjs(),
    nodeResolve(),
  ],
};
