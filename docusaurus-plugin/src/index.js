const path = require("path");
const webpack = require("webpack");

module.exports = function (context, options) {
  return {
    name: "custom-docusaurus-plugin",
    configureWebpack(config, isServer, utils) {
      return {
        plugins: [
          new webpack.DefinePlugin({
            process: { env: {} }, // to bypass "process is not defined" from oa-verify inside of @govtechsg/tradetrust-utils
          }),
        ],
        module: {
          rules: [
            {
              test: /\.(tsx|ts)?$/,
              use: {
                loader: "ts-loader", // to load ts in @govtechsg/tradetrust-utils
                options: {
                  allowTsInNodeModules: true,
                },
              },
            },
          ],
        },
        resolve: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
          },
        },
      };
    },
  };
};
