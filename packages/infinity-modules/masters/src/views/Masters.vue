<template>
  <div>
    <settings-layout
      v-if="!loading"
      :items="this.itemSorted"
      headerTitle="Master Data"
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
      itemSorted: [],
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
    this.ascOrder();
  },
  methods: {
    ...mapActions('masters', ['getElements', 'getAssets']),
    async ascOrder() {
      const res = this.masterItems.sort((a, b) => a.title.localeCompare(b.title));
      const first = res.pop();
      res.unshift(first);
      this.itemSorted = res;
    },
  },
};
</script>
