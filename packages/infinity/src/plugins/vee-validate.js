import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  // setInteractionMode,
  extend,
} from 'vee-validate';
import {
  confirmed,
  required,
  digits,
  email,
  max,
} from 'vee-validate/dist/rules';

Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);

// setInteractionMode('eager');

extend('confirmed', confirmed);
extend('required', required);
extend('digits', digits);
extend('email', email);
extend('max', max);
