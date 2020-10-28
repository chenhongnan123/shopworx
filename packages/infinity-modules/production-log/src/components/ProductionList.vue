<template>
  <div style="height:100%">
    <template v-if="loading">
      <production-loading />
    </template>
    <template v-else-if="error">
      <production-error />
    </template>
    <template v-else-if="!error && !production">
      <production-no-records />
    </template>
    <template v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline ml-4 font-weight-medium"
        v-for="(shiftData, shiftKey, i) in production"
      >
        {{ shiftKey }}
        <div
          :key="j"
          class="title mt-2 font-weight-medium"
          v-for="(machineData, machineKey, j) in shiftData"
        >
          <span class="primary--text">
            {{ machineKey }} |
            <v-btn small outlined color="primary" class="text-none">
              <v-icon small left>mdi-account-hard-hat</v-icon>
              Suresh
              <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
            </v-btn>
          </span>
          <div
            :key="k"
            class="mb-4"
            v-for="(productionList, k) in machineData"
          >
            <production-list-item
              :production="productionList"
              class="mr-4"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import ProductionLoading from './ProductionLoading.vue';
import ProductionError from './ProductionError.vue';
import ProductionNoRecords from './ProductionNoRecords.vue';
import ProductionListItem from './ProductionListItem.vue';

export default {
  name: 'ProductionList',
  components: {
    ProductionLoading,
    ProductionError,
    ProductionNoRecords,
    ProductionListItem,
  },
  computed: {
    ...mapState('productionLog', [
      'loading',
      'error',
      'selectedDate',
    ]),
    ...mapGetters('productionLog', ['production']),
  },
  methods: {
    ...mapActions('productionLog', ['fetchProductionList']),
  },
  created() {
    this.fetchProductionList();
  },
  watch: {
    selectedDate(val) {
      if (val) {
        this.fetchProductionList();
      }
    },
  },
};
</script>
