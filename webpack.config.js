module.exports = {
  entry: ['regenerator-runtime/runtime', './index.js'],
  output: {
    filename: 'bundle.js',
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
