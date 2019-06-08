const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
// const webpack = require('webpack');

function resolves(_path) {
  //  __dirname 当前模块的目录名(这里是/, 也就是根目录)
  //  path.resolve将resolve里的参数解析成绝对路径(假如_path为'dist', 那么会生成/dist这样的绝对路径)
  return path.resolve(__dirname, _path);
}
const src_path = resolves('./src');
module.exports = {
  entry: ['webpack-hot-middleware/client?noInfo=true&reload=true', src_path],
  output: { //  出口配置
    path: resolves('dist'),
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/'
  },
  resolve: { //  解析配置
    extensions: ['.ts', '.tsx', '.js'], //  解析以数组里的后缀结尾的文件
    alias: { //  别名
      '@': src_path
    }
  },
  context: src_path, // 上下文设置(绝对路径)，用于从配置中解析入口起点(entry point)和loader!
  // 也就是设置成你development下的目录(通常是src目录)
  module: { //  模块Loader配置
    rules: [
      /**
       * 传递字符串( 如：use: ['style-loader'] )是loader属性的简写方式( 如：use: [{loader: 'style-loader'}] ) 
       * Rule.loader 是 Rule.use: [ { loader } ] 的简写。
       */
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // modules: true,  //  注意: 这里设置了这个东西之后，样式的类名会产生一个像base64的字符串，从而和html上的类名不一致，导致不能正确的应用样式
              sourceMap: true
            }
          }
        ],
        include: src_path
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: src_path
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: src_path
      }
    ]
  },
  plugins: [ //  插件配置
    new HtmlWebpackPlugin({
      title: 'Git',
      filename: devMode ? 'index.html' : 'index.[hash].html',
      template: '../index.html'
    }),
    new CleanWebpackPlugin(),
    // new webpack.ProvidePlugin({ //  将 lodash library 中的其余没有用到的导出去除。(但似乎没什么效果, 可能是配置错了...)
    //   _: 'lodash'
    // })
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
  ]
};