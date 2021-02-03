<template>
  <div>
    <settings-layout
      v-if="!loading"
      :items="masterItems"
      :headerTitle="$t('masters')"
      windowRouteName="masterWindow"
    >
      <master-window />
    </settings-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';
import MasterWindow from './MasterWindow.vue';

export default {
  name: 'Admin',
  components: {
    SettingsLayout,
    MasterWindow,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters('masters', ['masterItems']),
  },
  async created() {
    this.loading = true;
    await this.getElements();
    await this.getAssets();
    this.loading = false;
  },
  methods: {
    ...mapActions('masters', ['getElements', 'getAssets']),
  },
};
</script>
