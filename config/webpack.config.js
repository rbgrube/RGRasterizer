const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')

module.exports =  {
  //mode: "development",
  entry: path.resolve(__dirname, '../src/webpack_entry.mjs'),

  output: {
    filename: 'rgrasterizer.js',
    path: path.resolve(__dirname, '../dist'),
    library: {
      name: 'RG',
      type: 'var'
    }
  },

  optimization: {
    minimize: false, // Enable minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@/, // Retain comments containing '@' (used in JSDoc)
          },
        },
        extractComments: false, // Ensure comments stay in the bundle
      }),
    ],
  },
  
};