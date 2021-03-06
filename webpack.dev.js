const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');

module.exports = {
    context: path.join(__dirname, "src"),
    entry: "./js/leaflet-textLayer.js",
    mode: "development",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "leaflet-textlayer.min.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, "css-loader",],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
            },
        ]
    },
    plugins: [new MiniCssExtractPlugin({ filename: "leaflet-textlayer.css" }),]
};