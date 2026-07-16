const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const monacoRules = [
  {
    test: /\.ttf$/,
    type: 'asset/resource'
  }
]

/** @type {import('next').NextConfig['webpack']} */
const webpackRules = (
    config,
    { isServer }
  ) => {

    // Modify config and then return it
    if(!isServer) {
      console.log(config)
      config.plugins.push(new MonacoWebpackPlugin({
        languages: ["javascript", "markdown", "yaml"],
        filename: "static/[name].worker.js",
      }))
      config.module.rules.push(...monacoRules)
    }

    return config
  };

  /** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: webpackRules,
}

module.exports = nextConfig