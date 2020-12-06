import Vue from 'vue';

export const set = (property) => (state, payload) => (state[property] = payload);

export const reactiveSet = (property) => (state, payload) => (Vue.set(state[property], payload.key, payload));

export const reactiveSetArray = (property) => (state, { index, payload }) => (Vue.set(state[property], index, payload));

export const toggle = (property) => (state) => (state[property] = !state[property]);

