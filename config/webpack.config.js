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
// 公共目录资源搬迁
const CopyPlugin = require("copy-webpack-plugin")

// Eleement 按需映入+主题色
const AutoImports = require("unplugin-auto-import/webpack")
const Components = require("unplugin-vue-components/webpack")
const {ElementPlusResolver} = require("unplugin-vue-components/resolvers")


const isProdection = process.env.NODE_ENV === "prodcution"


// common js 模块化
module.exports = {
    // 入口/出口配置
    entry: "./src/main.js",
    output: {
        path: isProdection ? paths.resolve(__dirname, '../dist') : undefined,
        filename: isProdection ? "./static/js/[name].[contenthash:8].js" : "./static/js/[name].js",
        chunkFilename: isProdection ? "static/js/[name].chunk.[contenthash:8].js" : "static/js/[name].chunk.js",
        clean: true,
    },

    module: {
        rules: [
            ...CSSConfig(isProdection ? MiNiCssExtractPlugin.loader : undefined),
            ...ORSConfig(),
            JSConfig(threads),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options:{
                    // 开启缓存
                    cacheDirectory:paths.resolve(__dirname, "../node_modules/.cache/vue-loader"),
                }
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
            context: paths.resolve(__dirname, '../src'),
            exclude: "node_modules",
            cache: true,									// eslint 缓存 
            cacheLocation: paths.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads
        }),
        // CSS 文件提取
        isProdection && new MiNiCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
        }),
        // preload|prpfetch
        new PreloadWebpackPlugin({
            rel: 'prefetch',
        }),
        // 配置pwa
        isProdection && new WorkboxPlugin.GenerateSW({
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
                    globOptions: {
                        ignore: ["**/index.html"]
                    }
                },
            ],
        }),
        // Element 按需引入 + 主题色
        AutoImports({
            resolvers:[ElementPlusResolver({
                importStyle: "sass",
            })]
        }),
        Components({
            resolvers:[ElementPlusResolver({
                importStyle: "sass",
            })]
        })
    ].filter(Boolean),
    // 压缩单独写出
    // css 压缩 + JS 多进程压缩 +  图片压缩
    optimization: {
        minimize:isProdection,
        minimizer: [
            new CssMinimizerPlugin(),
            // 图片压缩封装减重
            ImageMinimizer(ImageMinimizerPlugin),
            // 并行JS 压缩
            new TerserWebpackPlugin({
                parallel: threads
            }),
            
        ],
        // splitCode
        splitChunks,
        // networkCache
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        },

    },
    devServer: {
        host: "localhost",
        port: "3000",
        open: true,      //自动开启浏览器
        hot: true,       // HMR
        historyApiFallback:true, //前端路由刷新404
    },
    // 优化:快速排错
    devtool: isProdection ? "source-map" : "cheap-module-source-map",
    // 生产模式
    mode: isProdection?"production":"development",
    // webpack 解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"],
        // 路径别名
        alias:{
            '@':paths.resolve(__dirname,"../src"),
        }
    },
    // Null
    performance: { hints: false },
}