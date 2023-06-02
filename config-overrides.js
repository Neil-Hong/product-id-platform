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
    config.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
    });
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
};
