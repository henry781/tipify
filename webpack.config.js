const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
    entry: './src/api.ts',
    target: 'node',
    devtool: 'source-map',
    stats: 'verbose',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'tipify.bundle.js',
        library: 'tipify',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new DtsBundleWebpack({
            name: 'tipify',
            main: 'dist/api.d.ts',
            baseDir: 'dist',
            verbose: false,
            removeSource: true
        })
    ]
};