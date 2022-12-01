module.exports = {
    root:true,
    "extends": ["plugin:vue/vue3-essential","eslint:recommended"],
    env:{
        node:true ,   // 启动node全局变量
    },
    "parserOptions":{
        parser:"@babel/eslint-parser"
    },
    rules:{
        // "no-var":2 ,    // 禁止使用var 变量
    }
    
}