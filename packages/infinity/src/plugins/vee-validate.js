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
  min,
  numeric,
  max_value,
  min_value,
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
extend('min', min);
extend('numeric', numeric);
extend('max_value', max_value);
extend('min_value', min_value);

extend('multiple_of', {
  validate(value, { multiple }) {
    return (((value * 100) % (multiple * 100)) / 100) === 0;
  },
  params: ['multiple'],
});

extend('greater_than_now', {
  validate(value) {
    return new Date(value).getTime() >= new Date().getTime();
  },
});

configure({
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`);
    return i18n.t('error.NOT_VALID', values);
  },
});
