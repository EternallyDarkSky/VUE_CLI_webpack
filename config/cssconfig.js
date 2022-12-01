

// CSS 封装减重
function getStyleLoader(loader="vue-style-loader",others=undefined) {
    return [
        loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                // css兼容智能预设
                postcssOptions: {
                    plugins: ["postcss-preset-env"], 
                }
            }
        },
        others &&  {
            loader:others,
            options:others=="sass-loader"?{
                additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
            }:{}
        }
    ].filter(Boolean)  // 自动过滤undefined
}
function CSSConfig(loader) {
    return [// CSS+Less 样式解析
        {
            test: /\.css$/i,
            use: getStyleLoader(loader),
        },
        {
            test: /\.less$/i,
            use: getStyleLoader(loader,"less-loader"),
        },
        {
            test: /\.s(a|c)ss$/i,
            use: getStyleLoader(loader,"sass-loader"),
        }]
}

module.exports = CSSConfig