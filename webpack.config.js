const path = require('path');
const modules = path.resolve(__dirname, './_build');

module.exports = {
    name: 'client',
    target: 'web',
    mode: 'development',
    context: __dirname,
    devtool: "inline-source-map",
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: 'bundle.js',
        path: modules,
        strictModuleExceptionHandling: true
    },
    resolve: {
        extensions: ['.js', '.svg'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    modules,
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["env", "stage-0"]
                        }
                    },
                ]
            },
        ]
    },
};