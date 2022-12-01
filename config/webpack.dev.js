// 开发模式配置文件

// Null
const paths = require("path")
// CSS 减重封装
const CSSConfig = require("./cssconfig")
// 其他资源封装减重
const ORSConfig = require("./orsconfig")
// JS 减重封装
const JSConfig = require("./jsconfig")

// 获取cpu核心数量
const os = require("os")
const threads = os.cpus().length  // 8
// Null
const webpack = require('webpack')
const { DefinePlugin} = require('webpack')
// HTML 网页自动编译插件
const htmlwebpackplugin = require('html-webpack-plugin')
// JS 代码规范插件
const ESLintPlugin = require('eslint-webpack-plugin');
// JS 多进程压缩
const TerserWebpackPlugin = require("terser-webpack-plugin")

// 代码分割 
const splitChunks = require('./splitchunk')
// preload|prefetch
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
// vue-loader
const { VueLoaderPlugin } = require('vue-loader')



// common js 模块化
module.exports = {
    // 入口/出口配置
    entry: ["./src/main.js"],
    output: {
        // 开发模式没有输出  
        path: undefined,
        // JS 输出路径及文件名设置
        filename: "static/js/[name].[contenthash:8].js",
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 使用的就是webpack m魔法名
        // assetModuleFilename:""
    },

    module: {
        rules: [
            ...CSSConfig(),
            ...ORSConfig(),
            JSConfig(threads),
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ],
    },
    plugins: [
        // Null
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // 网页自动编译
        new htmlwebpackplugin({
            template: "./public/index.html"
        }),
        //  JS 语法规范
        // 多线程编译 + cache 开启 + 文件排除
        new ESLintPlugin({
            context: paths.resolve(__dirname, '../src'),// 需要回退一层
            exclude: "node_modules",
            cache: true,									// 开启eslint 缓存   
            cacheLocation: paths.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads,
        }),
        // preload|prefetch
        new PreloadWebpackPlugin({
            rel: 'prefetch',
        }),
         // vue-loader 插件！
        new VueLoaderPlugin(),
        // cross-env 定义的环境变量是供Webpack使用
        // DefinePlugin 定义的环境变量供源代码使用
        // 从而解决Vue3页面报错问题
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false
        }),

        
    ],
    // 压缩单独写出
    // JS 多进程压缩TreeShaking
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: threads
            })
        ],
        // splitCode
        splitChunks,
        // networkCache
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        }
    },

    // 开发服务器(仅开发模式使用)
    devServer: {
        host: "localhost",
        port: "3000",
        open: true,      //自动开启浏览器
        hot: true,       // HMR
        historyApiFallback:true, //前端路由刷新404
    },
    // 优化:快速排错
    devtool: "cheap-module-source-map", //开发模式推荐使用
    // 开发模式
    mode: "development",

    // webpack 解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"]
    },
    // Null
    performance: { hints: false },
}