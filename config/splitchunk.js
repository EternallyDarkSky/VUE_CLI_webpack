module.exports = {
    chunks: "all",  //对所有模块都进行分割 
    cacheGroups:{
        vue:{
            test:/[\\/]node_modules[\\/]vue(.*)?[\\/]/,
            name:"vue-chunk",
            priority:40
        },
        elementplus:{
            test:/[\\/]node_modules[\\/]element-plus[\\/]/,
            name:"elementPlus-chunk",
            priority:30
        },
        libs:{
            test:/[\\/]node_modules[\\/]/,
            name:"libs-chunk",
            priority:20
        },
    }
}  