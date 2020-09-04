process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      '/server': {
<<<<<<< HEAD
        target: 'http://192.168.30.100/server',
=======
        target: 'http://192.168.1.161/server',
>>>>>>> dev
        changeOrigin: true,
        pathRewrite: {
          '^/server': '',
        },
      },
      '/sse': {
        target: 'http://192.168.1.161/sse',
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
