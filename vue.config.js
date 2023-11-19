const { defineConfig } = require('@vue/cli-service')
module.exports =
    defineConfig({
      transpileDependencies: [
          'vuetify'
      ],
      devServer:{
          allowedHosts: ['red.mlsat.ru', 'anton.mlsat.ru']
      }
    })

