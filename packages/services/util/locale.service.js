import Cookies from 'js-cookie';

class LocaleService {
  getLocale() {
    return Cookies.get('locale');
  }

  setLocale(locale) {
    return Cookies.set('locale', locale, { path: '/' });
  }
}

export default new LocaleService();
