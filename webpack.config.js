module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // Inject styles into DOM
          "css-loader", // Translate CSS into CommonJS
          "postcss-loader", // Process CSS with PostCSS
          "resolve-url-loader", // Resolve relative paths in URLs
          "sass-loader", // Compile Sass to CSS
        ],
      },
    ],
  },
};
