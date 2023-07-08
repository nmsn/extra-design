module.exports = (api, options) => {
  const { NODE_ENV } = options || process.env;
  const modules = NODE_ENV === "esm" ? false : "commonjs";

  if (api) {
    api.cache(() => NODE_ENV);
  }

  const plugins = ["lodash", ["@babel/plugin-transform-runtime"], ["import"]];

  // if (modules) {
  //   plugins.push("add-module-exports");
  // }

  return {
    presets: [
      ["@babel/preset-env"],
      ["@babel/preset-react", { runtime: "automatic" }],
      "@babel/preset-typescript",
    ],
    plugins,
  };
};
