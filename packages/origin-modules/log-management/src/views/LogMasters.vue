<template>
  <div>
    <portal to="app-header">
      {{$t('logManagement')}}
    </portal>
      <log-master-window />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LogMasterWindow from './LogMasterWindow.vue';

export default {
  name: 'LogMaster',
  components: {
    LogMasterWindow,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters('logManagement', ['masterItems']),
  },
  async created() {
    this.loading = true;
    await this.initElements();
    this.loading = false;
  },
  methods: {
    ...mapActions('logManagement', ['initElements']),
  },
};
</script>
