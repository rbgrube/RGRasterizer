const path = require('path');

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

  
};