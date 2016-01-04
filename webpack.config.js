var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = [
    // new webpack.optimize.CommonsChunkPlugin('common.js'),
    new ExtractTextPlugin("style.css")
];

module.exports = {
    entry: './src/main.js',
    output: {
        path: './dist',
        publicPath: 'dist/',
        filename: 'build.js?[hash]'
    },
    
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            // edit this for additional asset file types
            test: /\.(png|jpg|gif)$/,
            loader: 'file?name=[name].[ext]?[hash]'
        }, 
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                "style-loader", "css-loader?sourceMap!cssnext-loader",{publicPath:'../'}
            )
        }, 
        {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        },
        {
            test: /\.ts$/,
            loader: "awesome-typescript-loader?module=commonjs"
        },
        {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }
        ]
    },
    // example: if you wish to apply custom babel options
    // instead of using vue-loader's default:
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },

    plugins:plugins
}

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin("style.css?[hash]"),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
} else {
    module.exports.devtool = '#source-map'
}
