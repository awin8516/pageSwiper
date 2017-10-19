const path = require('path');

module.exports = {
  entry: './src/pageSwiper.js',
  output: {
    filename: 'pageSwiper.min.js',
    path: path.resolve(__dirname, 'dist')
  },
	module:{
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader:  'babel-loader',
      },      
     { test: /\.css$/, loader: 'style-loader!css-loader' },
	 { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ],
  }
};