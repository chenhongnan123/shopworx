<template>
  <div>
    <span>{{ $t('logManagement') }}</span>
    <!-- <settings-layout
      v-if="!loading"
      :items="staticItemList"
      :headerTitle="$t('logManagement')"
      windowRouteName="logMasterWindow"
    >
    </settings-layout> -->
      <log-master-window />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import SettingsLayout from '@/components/layout/SettingsLayout.vue';
import LogMasterWindow from './LogMasterWindow.vue';

export default {
  name: 'LogMaster',
  components: {
    // SettingsLayout,
    LogMasterWindow,
  },
  data() {
    return {
      loading: false,
      staticItemList: [
        {
          id: 1,
          title: 'Communication Log',
          to: 'CL',
          icon: 'Communication Log',
        },
        {
          id: 2,
          title: 'Machine Failure Log',
          to: 'MF',
          icon: 'Machine Failure Log',
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
