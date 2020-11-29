<template>
  <div style="height:100%">
    <template v-if="loading">
      <planning-loading />
    </template>
    <template v-else-if="error">
      <planning-error />
    </template>
    <template v-else-if="!error && !notStartedPlans">
      <planning-no-records />
    </template>
    <template v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline ml-4 font-weight-medium"
        v-for="(groupData, groupKey, i) in notStartedPlans"
      >
        <div class="primary--text">
          {{ groupKey }}
        </div>
        <v-data-table
          :items="groupData.values"
          :headers="headers"
          hide-default-footer
          item-key="_id"
        >
          <template #body="{ items }">
            <draggable
              :list="items"
              tag="tbody"
              group="plans"
            >
              <tr
                v-for="(item, index) in items"
                :key="index"
                handle=".handle"
              >
                <td>
                  <v-icon class="handle">mdi-drag</v-icon>
                </td>
                <td>
                  {{ index + 1 }}
                </td>
                <td>
                  {{ item.planid }}
                </td>
                <td>
                  {{ item.partname }}
                </td>
                <td>
                  {{ item.equipmentname }}
                </td>
                <td>
                  {{ item.plannedquantity }}
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Draggable from 'vuedraggable';
import PlanningLoading from './PlanningLoading.vue';
import PlanningError from './PlanningError.vue';
import PlanningNoRecords from './PlanningNoRecords.vue';

export default {
  name: 'ReorderPlanList',
  components: {
    Draggable,
    PlanningLoading,
    PlanningError,
    PlanningNoRecords,
  },
  data() {
    return {
      headers: [
        { text: '', value: 'drag' },
        { text: 'Execution order', value: 'sortindex' },
        { text: 'Plan', value: 'planid' },
        {
          text: 'Part',
          value: 'partname',
          width: '30%',
        },
        {
          text: 'Equipment',
          value: 'equipmentname',
          width: '30%',
        },
        {
          text: 'Planned Qty',
          value: 'plannedquantity',
        },
      ],
    };
  },
  computed: {
    ...mapState('productionPlanning', [
      'loading',
      'error',
    ]),
    ...mapGetters('productionPlanning', ['notStartedPlans']),
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchReorderPlanList']),
  },
  created() {
    this.fetchReorderPlanList();
  },
};
</script>
