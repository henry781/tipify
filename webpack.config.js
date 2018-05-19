const path = require('path');

module.exports = {
    entry: './src/api.ts',
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
        filename: 'jsontypescript.js',
        path: path.resolve(__dirname, 'dist')
    }
};