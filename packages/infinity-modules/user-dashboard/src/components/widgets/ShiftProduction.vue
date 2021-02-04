<template>
  <v-card>
    <v-card-title>
      Shift production
    </v-card-title>
    <v-card-text v-if="productionLoading">
      <production-loading />
    </v-card-text>
    <v-card-text v-else-if="!productionLoading && !production">
      <production-no-records />
    </v-card-text>
    <v-card-text v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline font-weight-medium"
        v-for="(machineData, machineKey, i) in production"
      >
        <div class="primary--text d-inline-block">
          {{ machineKey }}
          <assign-operator
            :shift="thisShift"
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
          disable-pagination
          hide-default-footer
        >
          <!-- eslint-disable-next-line -->
          <template #item.produced="{ item }">
            <span class="info--text">
              {{ item.produced }}
            </span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.accepted="{ item }">
            <span class="success--text">
              {{ item.accepted }}
            </span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.rejected="{ item }">
            <div class="error--text d-inline-block mt-1">
              {{ item.rejected }}
            </div>
            <span class="float-right">
              <assign-rejections :production="item" />
            </span>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProductionLoading from './production/ProductionLoading.vue';
import ProductionNoRecords from './production/ProductionNoRecords.vue';
import AssignOperator from './production/AssignOperator.vue';
import AssignRejections from './production/AssignRejections.vue';

export default {
  name: 'ShiftProduction',
  components: {
    ProductionLoading,
    ProductionNoRecords,
    AssignOperator,
    AssignRejections,
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
        { text: 'Produced', value: 'produced' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
      ],
    };
  },
  computed: {
    ...mapState('userDashboard', ['productionLoading', 'thisShift']),
    ...mapGetters('userDashboard', ['production']),
  },
};
</script>
