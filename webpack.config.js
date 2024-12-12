const path = require('path');

module.exports = {
    entry: {
        'frontend': './src/index.tsx',
        'admin': './src/admin.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'assets/js'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};

