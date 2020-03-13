import { set } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    items: [
      {
        header: 'admin',
      },
      {
        title: 'users',
        icon: '$users',
        to: 'users',
      },
      {
        title: 'permissions',
        icon: '$permissions',
        to: 'permissions',
      },
      {
        title: 'alerts',
        icon: '$alerts',
        to: 'alerts',
      },
    ],
    loading: false,
    error: false,
  },
  mutations: {
    setItems: set('items'),
    setLoading: set('loading'),
    setError: set('error'),
  },
});
