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
          <div class="title d-inline-block">
            {{ machineKey }}
            <assign-operator
              :shift="shiftKey"
              :machine="machineKey"
              :operator="{
                operatorcode: machineData.operatorcode,
                operatorname: machineData.operatorname,
              }"
            />
          </div>
          <v-data-table
            :items="machineData.production"
            :headers="headers"
            hide-default-footer
          >
            <template #item="{ item }">
              <production-list-item :production="item" />
            </template>
          </v-data-table>
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
import AssignOperator from './AssignOperator.vue';

export default {
  name: 'ProductionList',
  components: {
    ProductionLoading,
    ProductionError,
    ProductionNoRecords,
    ProductionListItem,
    AssignOperator,
  },
  data() {
    return {
      headers: [
        { text: 'Plan', value: 'planid' },
        {
          text: 'Part',
          value: 'partname',
          width: '25%',
        },
        { text: 'Production start', value: 'firstcycle' },
        { text: 'Production end', value: 'lastcycle' },
        { text: 'Produced', value: 'produced' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Rework', value: 'rework' },
        { text: 'Scrap (in Kg)', value: 'scrap' },
      ],
    };
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
