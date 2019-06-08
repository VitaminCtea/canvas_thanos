function emitWarning () { //  用于只显示一次警告.
  if (!process.warned) {
    process.warned = true;
    process.emitWarning('Only warn once!');
  }
}
emitWarning();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
function resolves(_path) {  //  __dirname 当前模块的目录名(这里是/, 也就是根目录)
  //  path.resolve将resolve里的参数解析成绝对路径(假如_path为'dist', 那么会生成/dist这样的绝对路径)
  return path.resolve(__dirname, _path);
}
const src_path = resolves('./src');
module.exports = {
  mode: 'development',  //  模式配置(可以在入口文件处重写)
  entry: [  //  入口配置
    'webpack-hot-middleware/client',
    '@babel/polyfill',
    src_path
  ],
  devtool: 'eval-source-map', //  信息提示配置
  output: { //  出口配置
    path: resolves('./dist'),
    filename: '[name].[hash].js',
    publicPath: ''
  },
  resolve: {  //  解析配置
    extensions: ['.ts', '.tsx', '.js'], //  解析以数组里的后缀结尾的文件
    alias: {  //  别名
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }),
        include: src_path
      },
      {
        test: /\.(sa|sc)ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
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
  plugins: [  //  插件配置
    new HtmlWebpackPlugin({
      title: 'Output Management',
      filename: 'index.html',
      template: '../index.html'
    }),
    new CleanWebpackPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: { //  优化配置
    usedExports: !!(process.env.NODE_ENV === 'production'), //  移除JavaScript上下文中的未引用代码(要想真正的一处未引入的代码需要在package.json文件中添加slideEffects: true选项。即所有代码都移除未import的代码。也可以用数组列出来哪些文件需要移除)
    runtimeChunk: 'single', //  将 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle
    splitChunks: {  //  可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk。
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  externals: {  //  外部扩展(不打包通过import引入的第三方库)
    _: {
      commonjs: 'lodash', //  CommonJS规范(Node.js环境中)
      amd: 'lodash',  //  AMD规范加载(相当于define(['lodash'], function(){}))
      root: '_' //  这里浏览器会报错(lodash源码中确实暴露出了一个全局变量_, 不知道为啥报错...)
    }
  },
  performance: {  //  性能配置
    hints: 'warning', //  大文件提示
    maxEntrypointSize: 1000000, // 入口起点的最大体积(当达到这个属性设置的值时, hints生效(1M))
    maxAssetSize: 500000,  // 任何文件的体积超过这个属性设置的值将提示(hints生效(500kb))
    assetFilter: function (assetFileName) { // 控制用于计算性能提示的文件(此处只控制js或ts文件)
      let reg = /\.(?:j|t)s$/;
      if (!reg.test(assetFileName)) return;
      return !!(assetFileName.lastIndexOf(assetFileName.match(reg)[0]));
    }
  }
};