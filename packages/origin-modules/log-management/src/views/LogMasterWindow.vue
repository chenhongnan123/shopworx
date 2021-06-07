<template>
  <div>
    <v-tabs
      v-if="showTabs(id)"
      v-model="tab"
      :background-color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-tab
        :key="asset.id"
        class="text-none"
      >
        <span v-text="asset.assetDescription"></span>
      </v-tab>
      <v-tab-item
        :key="asset.id"
        v-for="asset in getAssets(id)"
      >
        <log-base-master
          :assetId="asset.id"
          :id="id"
          ref="base"
        />
      </v-tab-item>
    </v-tabs>
    <log-base-master
      v-else
      :id="id"
      ref="base"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import LogBaseMaster from '../components/LogBaseMaster.vue';

export default {
  name: 'LogMasterWindow',
  components: {
    LogBaseMaster,
  },
  data() {
    return {
      base: '',
      tab: 0,
      showUpdateBtn: false,
    };
  },
  mounted() {
    this.base = this.$refs.base;
  },
  methods: {
    // ...mapActions('logManagement', ['', '']),
    ...mapMutations('helper', ['setAlert']),
  },
  computed: {
    ...mapGetters('logManagement', ['showTabs', 'getAssets']),
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
