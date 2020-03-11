<template>
  <v-card flat class="transparent">
    <template v-if="elementLoading">
      Loading...
    </template>
    <template v-else-if="elementError">
      Error
    </template>
    <template v-else>
      <v-card-title class="pa-0 py-1">
        <span v-text="$t(`masters.elements.${id}`)"></span>
      </v-card-title>
      <v-tabs
        v-if="isAssetBased"
        v-model="currentAsset"
      >
        <v-tab
          :key="asset.id"
          class="text-none"
          v-for="asset in assets"
        >
          <span v-text="asset.assetDescription"></span>
        </v-tab>
        <v-tab-item
          :key="asset.id"
          v-for="asset in assets"
        >
          <component
            :is="component"
            :tags="getTags(asset.id)"
            :records="getRecords(asset.id)"
          />
        </v-tab-item>
      </v-tabs>
      <component
        v-else
        :is="component"
        :tags="getTags()"
        :records="getRecords()"
      />
    </template>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import BaseMaster from './base/BaseMaster.vue';
import BusinessMonthStart from './calendar/BusinessMonthStart.vue';
import BusinessWorkingDays from './calendar/BusinessWorkingDays.vue';
import BusinessHours from './calendar/BusinessHours.vue';
import BusinessHolidays from './calendar/BusinessHolidays.vue';

export default {
  name: 'MasterWindow',
  components: {
    BaseMaster,
    BusinessMonthStart,
    BusinessWorkingDays,
    BusinessHours,
    BusinessHolidays,
  },
  data() {
    return {
      currentAsset: 0,
    };
  },
  async created() {
    if (this.id) {
      await this.fetchData();
    }
  },
  methods: {
    ...mapActions('masters', ['initMasterData']),
    async fetchData() {
      await this.initMasterData(this.id);
    },
  },
  watch: {
    async id() {
      await this.fetchData();
    },
  },
  computed: {
    ...mapState('masters', [
      'assets',
      'elementLoading',
      'dataLoading',
      'elementError',
    ]),
    ...mapGetters('masters', ['getTags', 'getRecords', 'element']),
    id() {
      return this.$route.params.id;
    },
    isAssetBased() {
      return this.element && this.element.assetBased;
    },
    component() {
      switch (this.id) {
        case 'businessyear':
          return 'business-month-start';
        case 'businessworkingdays':
          return 'business-working-days';
        case 'businesshours':
          return 'business-hours';
        case 'businessholidays':
          return 'business-holidays';
        default:
          return 'base-master';
      }
    },
  },
};
</script>
