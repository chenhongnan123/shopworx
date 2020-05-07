process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      '/server': {
        target: 'http://13.127.85.87/server',
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
