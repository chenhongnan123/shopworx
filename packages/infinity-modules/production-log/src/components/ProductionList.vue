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
            disable-pagination
            hide-default-footer
          >
            <!-- eslint-disable-next-line -->
            <template #item.firstcycle="{ item }">
              {{ new Date(item.firstcycle).toLocaleTimeString('en-GB') }}
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.lastcycle="{ item }">
              {{ new Date(item.lastcycle).toLocaleTimeString('en-GB') }}
            </template>
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
            <!-- eslint-disable-next-line -->
            <template #item.rework="{ item }">
              <div class="warning--text d-inline-block mt-1">
                {{ item.rework }}
              </div>
              <span class="float-right">
                <assign-rework :production="item" />
              </span>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.scrap="{ item }">
              <div class="warning--text d-inline-block mt-1">
                {{ parseFloat(item.scrap).toFixed(2) }}
              </div>
              <span class="float-right">
                <assign-scrap :production="item" />
              </span>
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
import AssignOperator from './AssignOperator.vue';
import AssignRejections from './AssignRejections.vue';
import AssignRework from './AssignRework.vue';
import AssignScrap from './AssignScrap.vue';

export default {
  name: 'ProductionList',
  components: {
    ProductionLoading,
    ProductionError,
    ProductionNoRecords,
    AssignOperator,
    AssignRejections,
    AssignRework,
    AssignScrap,
  },
  data() {
    return {
      headers: [
        { text: this.$t('production.plan'), value: 'planid' },
        {
          text: this.$t('production.part'),
          value: 'partname',
          width: '25%',
        },
        { text: this.$t('production.start'), value: 'firstcycle' },
        { text: this.$t('production.end'), value: 'lastcycle' },
        { text: this.$t('production.produced'), value: 'produced' },
        { text: this.$t('production.accepted'), value: 'accepted' },
        { text: this.$t('production.rejected'), value: 'rejected' },
        { text: this.$t('production.rework'), value: 'rework' },
        { text: this.$t('production.scrap'), value: 'scrap' },
      ],
    };
  },
  computed: {
    ...mapState('productionLog', [
      'loading',
      'error',
    ]),
    ...mapGetters('productionLog', ['production']),
  },
  methods: {
    ...mapActions('productionLog', ['fetchProductionList']),
  },
  created() {
    this.fetchProductionList();
  },
};
</script>
