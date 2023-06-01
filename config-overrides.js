const webpack = require("webpack");
module.exports = function override(config, env) {
    config.resolve.fallback = {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        assert: require.resolve("assert/"),
        stream: require.resolve("stream-browserify"),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser.js",
            Buffer: ["buffer", "Buffer"],
        })
    );
    config.ignoreWarnings = [
        { module: /node_modules\/web3/ },
        { module: /node_modules\/dag-jose/ },
        { module: /node_modules\/@chainsafe/ },
    ];
    return config;
};
