module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      '/server': {
        target: 'http://demo.shopworx.io:1013/server',
        changeOrigin: true,
        pathRewrite: {
          '^/server': '',
        },
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
