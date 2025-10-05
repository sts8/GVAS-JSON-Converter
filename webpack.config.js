import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

const __dirname = import.meta.dirname;

export default {
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
        watchFiles: ['src/**/*'],
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
