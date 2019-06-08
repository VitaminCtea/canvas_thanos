function emitWarning() {    //  用于只显示一次警告.
  if (!process.warned) {
    process.warned = true;
    process.emitWarning('Only warn once!');
  }
}
emitWarning();
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = merge(common, {
  mode: 'production', //  mode模式为production时，自动启用压缩
  plugins: [
    new webpack.HashedModuleIdsPlugin(),  //  Vendor hash值固定(即: 打包后hash值不会变化, 使其缓存下来)
  ],
  optimization: { //  优化配置
    minimizer: [
      new OptimizeCssAssetsPlugin(), //  压缩生产环境中的所有css文件
    ],
    usedExports: !!(process.env.NODE_ENV === 'production'), //  移除JavaScript上下文中的未引用代码(要想真正的一处未引入的代码需要在package.json文件中添加slideEffects: true选项。即所有代码都移除未import的代码。也可以用数组列出来哪些文件需要移除)
    runtimeChunk: 'single', //  将 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle
    splitChunks: {  //  可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk.
      maxAsyncRequests: 5,  //  按需加载时候最大的并行请求数，默认为5
      automaticNameDelimiter: '~',  //  抽取出来的文件的自动生成名字的分割符，默认为 ~；
      cacheGroups: {  //  缓存组(可以继承/覆盖上面 splitChunks 中所有的参数值)
        vendor: {
          test: /[\\/]node_modules[\\/]/, //  用于控制哪些模块被这个缓存组匹配到
          name: 'vendors',
          chunks: 'initial',  //  表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
          reuseExistingChunk: true, //  如果当前块包含已从主束拆分的模块，则将重用它而不是生成新的块。这可能会影响块的结果文件名。
          priority: -10 //  表示抽取权重，数字越大表示优先级越高。(表示如第三方库是先抽取还是后抽取)
        },
        styles: {
          name: 'styles/css_world',
          test: /\.(cs|sas)s$/,
          chunks: 'initial',
          enforce: true,
        },
      }
    }
  },
  externals: {  //  外部扩展(不打包通过import引入的第三方库)
    _: {
      commonjs: 'lodash', //  CommonJS规范(Node.js环境中)
      amd: 'lodash',  //  AMD规范加载(相当于define(['lodash'], function(){}))
      root: '_' //  暴露一个全局变量
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
});
