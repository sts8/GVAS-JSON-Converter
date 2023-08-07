const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/website/main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/website/index.html"
        }),
        new CopyPlugin({
            patterns: [
                {context: "./src/website/", from: "css/*"}
            ]
        })
    ],
    output: {
        filename: "bundle.js",
        clean: true
    }
};
