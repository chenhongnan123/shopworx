import Vue from 'vue';

export const set = (property) => (state, payload) => (state[property] = payload);

export const reactiveSet = (property) => (state, payload) => (Vue.set(state[property], payload.key, payload));

export const toggle = (property) => (state) => (state[property] = !state[property]);

