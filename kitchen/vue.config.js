// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "http://120.78.221.14:2233",
                ws: true,
                changeOrigin: true
            }
        }
    }
};