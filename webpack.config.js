const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/website/main.js')
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/'),
        clean: true
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist/'),
        },
        open: true,
        hot: true,
        host: 'localhost',
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/website/index.html')
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, 'src/website/'),
                    from: 'css/*',
                    to: path.resolve(__dirname, 'dist/')
                }
            ]
        })
    ]
};
