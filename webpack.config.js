var path = require('path')
var webpack = require('webpack')
var ExtractText = require('extract-text-webpack-plugin')
var HtmlPlugin = require('html-webpack-plugin')

var resolve = function (dir) {
    return path.resolve(__dirname, dir)
}

var isProd = process.env.NODE_ENV === 'production'
var isDev = !isProd

var plugins = isDev ? [
    new webpack.HotModuleReplacementPlugin()
] : [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractText('style-[contentHash:10].css')
]

plugins.push(
    new HtmlPlugin({
        template: resolve('./index.template.html'),
    })
)

var cssIdentifier = isProd ? '[hash:base64:10]' : '[path][name]---[local]'
var cssLoader = isProd ? ExtractText.extract({
    loader: `css-loader?localIdentName=${cssIdentifier}`,
}) : ['style-loader', `css-loader?localIdentName=${cssIdentifier}`]

module.exports = {
    devtool: isProd ? 'cheap-module-source-map' : 'source-map', // Allow Source Map to Debug
    entry: resolve('./src/index.js'),
    plugins,
    resolve: {
        modules: [resolve('./src'), resolve('./node_modules')],
        extensions: ['.js'],
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: '/(node_modules|spec/.js$)/',
        },
        {
            test: /\.(png|jpg|gif)$/,
            loaders: ['url-loader?limit=15000&name=images/[hash:8].[ext]'],
            exclude: '/node_modules/',
        },
        {
            test: /\.(css)$/,
            loaders: cssLoader,
            exclude: '/node_modules',
        },
        {
            test: /\.(eot|otf|ttf|woff|woff2)$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        }],
    },
    output: {
        path: resolve('./dist'),
        publicPath: './',
        filename: isProd ? 'bundle-[hash:12].min.js' : 'bundle.js',
    },
}
