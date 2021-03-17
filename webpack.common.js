const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './demo/src/scripts/main.js',
  output: {
    filename: 'scripts/main.js',
    path: path.resolve(__dirname, 'demo/dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'demo/src/index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     plugins: [
          //       // require("autoprefixer")({
          //       //   grid: true
          //       // })
          //     ]
          //   }
          // },
          {
            loader: "sass-loader"
          }
        ]
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
    ]
  },
  resolve: {
    fallback: {
      fs: false,
      buffer: false,
      path: false,
    }
  }
};
