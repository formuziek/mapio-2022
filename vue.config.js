module.exports = {
    configureWebpack: {
        resolve: {
            fallback: {
                "fs": false,
                "url": false,
                "path": false,
            }
        }
    }
};