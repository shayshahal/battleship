const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module:
    {
    rules: [
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        },
    ]
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 5500,
        open: true,
        hot: true,
        compress: true,
    }
});