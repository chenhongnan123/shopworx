<template>
  <div style="height:100%">
    <template v-if="loading">
      <planning-loading />
    </template>
    <template v-else-if="error">
      <planning-error />
    </template>
    <template v-else-if="!error && !planning">
      <planning-no-records />
    </template>
    <template v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline ml-4 font-weight-medium"
        v-for="(groupData, groupKey, i) in planning"
      >
        <!-- <div class="primary--text">
          {{ getPlanStatus(groupKey).text }}
        </div> -->
        <div class="primary--text">
          {{ groupKey }}
        </div>
        <v-data-table
          v-model="selected"
          :items="groupData.values"
          :headers="headers"
          hide-default-footer
          item-key="_id"
        >
          <!-- eslint-disable-next-line -->
          <template #item.status="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar
                  size="16"
                  class="mb-1"
                  v-bind="attrs"
                  v-on="on"
                  :color="getPlanStatus(item.status).color"
                ></v-avatar>
              </template>
              {{ getPlanStatus(item.status).text }}
            </v-tooltip>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.planid="{ item }">
            <span>
              {{ item.planid }}
            </span>
          </template>
        </v-data-table>
      </div>
    </template>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import PlanningLoading from './PlanningLoading.vue';
import PlanningError from './PlanningError.vue';
import PlanningNoRecords from './PlanningNoRecords.vue';

export default {
  name: 'PlanningList',
  components: {
    PlanningLoading,
    PlanningError,
    PlanningNoRecords,
  },
  data() {
    return {
      headers: [
        { text: '', value: 'status' },
        { text: 'Plan', value: 'planid' },
        {
          text: 'Part',
          value: 'partname',
          width: '25%',
        },
        {
          text: 'Equipment',
          value: 'equipmentname',
          width: '25%',
        },
        {
          text: 'Planned Qty',
          value: 'plannedquantity',
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('productionPlanning', [
      'loading',
      'error',
      'selectedPlans',
    ]),
    ...mapGetters('productionPlanning', ['planning', 'planStatus']),
    selected: {
      get() {
        return this.selectedPlans;
      },
      set(val) {
        this.setSelectedPlans(val);
      },
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchPlanningList']),
    ...mapMutations('productionPlanning', ['setSelectedPlans']),
    getPlanStatus(status) {
      return this.planStatus(status);
    },
  },
  created() {
    this.fetchPlanningList();
  },
};
</script>
