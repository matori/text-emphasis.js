const path = require("path")
const webpack = require("webpack")
const LicenseInfoWebpackPlugin = require("license-info-webpack-plugin").default
const pkg = require("./package")

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "text-emphasis.js",
    path: path.join(__dirname, "umd"),
    library: "TextEmphasis",
    libraryTarget: "umd",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new LicenseInfoWebpackPlugin({
      glob: "{LICENSE,license,License}*",
    }),
    new webpack.BannerPlugin({
      banner: `${pkg.name}@${pkg.version} | ${pkg.author} | License: ${pkg.license}`,
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "example"),
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "browser"),
    ],
    watchContentBase: true,
  },
}
