// 生产模式配置文件

// 获取cpu核心数量
const os = require("os")
const threads = os.cpus().length  // 8
// Null
const paths = require("path")
// CSS 减重封装
const CSSConfig = require("./cssconfig")
// 其他资源封装减重
const ORSConfig = require("./orsconfig")
// JS 减重封装
const JSConfig = require("./jsconfig")

// Null
const webpack = require('webpack')
const { DefinePlugin } = require('webpack')
// HTML 网页自动编译插件
const htmlwebpackplugin = require('html-webpack-plugin')
// JS 代码规范插件
const ESLintPlugin = require('eslint-webpack-plugin');
// Css 文件提取插件，替代style-loader的方案
const MiNiCssExtractPlugin = require("mini-css-extract-plugin")
//+ CSS 文件压缩插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


//+ 图像的压缩插件
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//+ 图片压缩封装减重
const ImageMinimizer = require("./imgcompression")
// JS 多进程压缩插件
const TerserWebpackPlugin = require("terser-webpack-plugin")
// 代码分割 
const splitChunks = require('./splitchunk')
// preload|prefetch
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
// PWA
const WorkboxPlugin = require('workbox-webpack-plugin')
// vue-loader
const { VueLoaderPlugin } = require('vue-loader')
// 
const CopyPlugin = require("copy-webpack-plugin")

// common js 模块化
module.exports = {
    // 入口/出口配置
    entry: "./src/main.js",
    output: {
        // 入口文件输出到js目录下
        filename: "./static/js/[name].[contenthash:8].js",
        path: paths.resolve(__dirname, '../dist'),   // 需要回退一层目录
        // 重编译历史文件清除
        clean: true,
        chunkFilename: "static/js/[name].chunk.[contenthash:8].js", // 使用的就是webpack 魔法名
    },

    module: {
        rules: [
            ...CSSConfig(MiNiCssExtractPlugin.loader),
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
            context: paths.resolve(__dirname, '../src'),// 回退一层
            exclude: "node_modules",
            cache: true,									// 开启eslint 缓存 
            cacheLocation: paths.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads
        }),
        // CSS 文件提取
        new MiNiCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
        }),
        // preload|prpfetch
        new PreloadWebpackPlugin({
            rel: 'prefetch',
        }),
        // 配置pwa
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
        }),
        new VueLoaderPlugin(),
        // cross-env 定义的环境变量是供Webpack使用
        // DefinePlugin 定义的环境变量供源代码使用
        // 从而解决Vue3页面报错问题
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        new CopyPlugin({
            patterns: [
                {   // public 下资源文件拷贝
                    from: paths.resolve(__dirname, "../public"), 
                    to: paths.resolve(__dirname, "../dist"),
                    globOptions:{
                        ignore:["**/index.html"]
                    }
                },

            ],
        }),
    ],
    // 压缩单独写出
    // css 压缩 + JS 多进程压缩 +  图片压缩
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({
                parallel: threads
            }),
            // 图片压缩封装减重
            ImageMinimizer(ImageMinimizerPlugin),
        ],
        // splitCode
        splitChunks,
        // networkCache
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        },

    },

    // 优化:快速排错
    devtool: "source-map",// 生产模式推荐使用
    // 生产模式
    mode: "production",
    // webpack 解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"]
    },
    // Null
    performance: { hints: false },
}