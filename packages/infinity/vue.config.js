process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      '/server': {
        target: 'http://35.154.51.34/server',
        changeOrigin: true,
        pathRewrite: {
          '^/server': '',
        },
      },
      '/sse': {
        target: 'http://35.154.51.34/sse',
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
