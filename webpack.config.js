var path = require("path");
var webpack = require("webpack");

module.exports = {
    devtool : "source-map",
    entry : ["./src/webClient.ts"],
    output: {
        filename: "cognigy-web-client.js",

        libraryTarget: "var",
        library: "Cognigy"
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                include: path.resolve(__dirname, "src"),
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new webpack.ProvidePlugin({
          Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'
        }),
        new webpack.optimize.UglifyJsPlugin([])
    ]
};