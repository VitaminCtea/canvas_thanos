const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
module.exports = merge(common, {
    mode: 'development', //  模式配置(可以在入口文件处重写)
    devtool: 'inline-source-map', //  信息提示配置
    plugins: [
        new webpack.HotModuleReplacementPlugin(),   //  开启热模块
    ]
})