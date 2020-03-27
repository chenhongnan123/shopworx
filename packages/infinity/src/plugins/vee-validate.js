import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  extend,
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);

setInteractionMode('lazy');
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
