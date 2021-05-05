import LocaleService from '@shopworx/services/util/locale.service';
import { set, toggle } from '@shopworx/services/util/store.helper';
import i18n from '../../i18n';
import AG_GRID_LOCALE_EN from '../../plugins/ag-grid-locale/locale.en';
import AG_GRID_LOCALE_CN from '../../plugins/ag-grid-locale/locale.cn';

export default ({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    alert: {
      show: false,
      type: null,
      message: null,
    },
    userAgent: navigator.userAgent,
    isSessionValid: true,
    locales: [
      {
        text: 'English',
        value: 'en',
      },
      {
        text: 'हिन्दी',
        value: 'hi',
      },
      {
        text: '中文',
        value: 'zhHans',
      },
      {
        text: 'ไทย',
        value: 'th',
      },
      {
        text: 'Deutsche',
        value: 'de',
      },
    ],
    isDark: null,
    insightsDrawer: false,
    extendedHeader: false,
    infinityLoading: false,
  },
  mutations: {
    setAlert: set('alert'),
    setIsSessionValid: set('isSessionValid'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setExtendedHeader: set('extendedHeader'),
    setInfinityLoading: toggle('infinityLoading'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
  },
  getters: {
    isWebView: ({ userAgent }) => userAgent.includes('wv'),

    agGridLocaleText: () => {
      const { locale } = i18n;
      switch (locale) {
        case 'zhHans':
          return AG_GRID_LOCALE_CN;
        default:
          return AG_GRID_LOCALE_EN;
      }
    },

    agGridTheme: ({ isDark }) => (isDark
      ? 'ag-theme-balham-dark'
      : 'ag-theme-balham'),

    locale: () => {
      const locale = LocaleService.getLocale();
      if (locale === 'zhHans') {
        return 'zh';
      }
      return locale;
    },
  },
});
