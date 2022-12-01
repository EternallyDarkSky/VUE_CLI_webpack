module.exports = {
    presets:[
         [
            //" 指定环境插件"
            "@vue/cli-plugin-babel/preset",
            // 配置信息
            {
                "corejs":"3" ,     // 指定刚才下载的core-js 版本
                // 使用corejs 的方式: useage=按需加载 , 
                "useBuiltIns": "usage" , 
            }
        ]
    ]
}