const {defineConfig} = require('@vue/cli-service')
module.exports =
    defineConfig({
        transpileDependencies: [
            'vuetify'
        ],
        lintOnSave: false,
        devServer: {
            allowedHosts: ['red.mlsat.ru', 'anton.mlsat.ru']
        }
    })

