<template>
  <div>
    <settings-layout
      v-if="!loading"
      :items="staticItemList"
      :headerTitle="$t('logManagement')"
      windowRouteName="logMasterWindow"
    >
      <log-master-window />
    </settings-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';
import LogMasterWindow from './LogMasterWindow.vue';

export default {
  name: 'LogMaster',
  components: {
    SettingsLayout,
    LogMasterWindow,
  },
  data() {
    return {
      loading: false,
      staticItemList: [
        {
          id: 1,
          title: 'User Log',
          to: 'UL',
          icon: 'User Log',
        }, {
          id: 2,
          title: 'Machine Failure Log',
          to: 'MF',
          icon: 'Machine Failure Log',
        }, {
          id: 3,
          title: 'Communication Log',
          to: 'CL',
          icon: 'Communication Log',
        }, {
          id: 4,
          title: 'Power Failure Log',
          to: 'PF',
          icon: 'Power Failure Log',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('logManagement', ['masterItems']),
  },
  async created() {
    this.loading = true;
    // await this.getElements();
    // await this.getAssets();
    this.loading = false;
  },
  methods: {
    ...mapActions('logManagement', ['getElements', 'getAssets']),
  },
};
</script>
