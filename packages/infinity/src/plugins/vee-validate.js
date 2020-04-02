import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  extend,
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import i18n from '../i18n';

Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);

setInteractionMode('lazy');
Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
    message: i18n.t(`validatoins.${rule}`),
  });
});

extend('phone', {
  validate: (value, [length]) => value.length === parseInt(length, 10),
  message: i18n.t('validatoins.phone'),
});
