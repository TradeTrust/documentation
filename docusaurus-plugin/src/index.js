const webpack = require("webpack");

module.exports = function (context, options) {
  return {
    name: "custom-docusaurus-plugin",
    configureWebpack(config, isServer, utils) {
      const isClient = !isServer;
      if (isClient) {
        return {
          plugins: [
            new webpack.DefinePlugin({
              process: { env: {} }, // to bypass "process is not defined" from oa-verify inside of @govtechsg/tradetrust-utils
            }),
          ],
          resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            fallback: {
              crypto: false,
            },
          },
        };
      }
    },
  };
};
