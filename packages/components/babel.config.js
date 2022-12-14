module.exports = (api, options) => {
  const { NODE_ENV } = options || process.env;
  const modules = NODE_ENV === 'esm' ? false : 'commonjs';

  if (api) {
    api.cache(() => NODE_ENV);
  }

  const plugins = [
    'lodash',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-transform-runtime', { useESModules: !modules }],
  ];

  if (modules) {
    plugins.push('add-module-exports');
  }

  return {
    presets: [
      ['@babel/preset-env', { modules, loose: true }],
      ['@babel/preset-react'],
      '@babel/preset-typescript',
    ],
    plugins,
  };
};
