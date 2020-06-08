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
      '/sse': {
        target: 'http://13.233.154.111/sse',
        changeOrigin: true,
        pathRewrite: {
          '^/sse': '',
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
