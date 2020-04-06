/* eslint-disable */
import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  configure,
  extend,
} from 'vee-validate';
import {
  required_if,
  confirmed,
  required,
  digits,
  email,
  max,
} from 'vee-validate/dist/rules';
import i18n from '../i18n';

Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);

setInteractionMode('lazy');

extend('required_if', required_if);
extend('confirmed', confirmed);
extend('required', required);
extend('digits', digits);
extend('email', email);
extend('max', max);

configure({
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`);
    return i18n.t('error.NOT_VALID', values);
  },
});
