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
        <span class="primary--text">
          {{ shiftKey }}
        </span>
        <div
          :key="j"
          class="mt-2"
          v-for="(machineData, machineKey, j) in shiftData"
        >
          <span class="title">
            {{ machineKey }}
          </span>
          <span class="title float-right mr-4">
            <edit-shift-operator
              :shift="shiftKey"
              :machine="machineKey"
              :operator="{
                operatorcode: machineData.operatorcode,
                operatorname: machineData.operatorname,
              }"
            />
          </span>
          <div
            :key="k"
            class="mb-4 mt-2"
            v-for="(productionList, k) in machineData.production"
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
import EditShiftOperator from './EditShiftOperator.vue';

export default {
  name: 'ProductionList',
  components: {
    ProductionLoading,
    ProductionError,
    ProductionNoRecords,
    ProductionListItem,
    EditShiftOperator,
  },
  computed: {
    ...mapState('productionLog', [
      'loading',
      'error',
      'selectedDate',
      'operators',
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
