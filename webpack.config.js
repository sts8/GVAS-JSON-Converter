const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyPlugin({
            patterns: [
                {context: "./src/", from: "css/*"}
            ]
        })
    ],
    output: {
        filename: "bundle.js",
        clean: true
    }
};
