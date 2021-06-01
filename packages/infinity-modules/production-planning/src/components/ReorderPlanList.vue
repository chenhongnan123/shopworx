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
          disable-pagination
          item-key="_id"
        >
          <template #body="{ items }">
            <draggable
              :list="items"
              @change="updateExecutionOrder"
              tag="tbody"
            >
              <tr
                v-for="(item, index) in items"
                :key="index"
                handle=".handle"
              >
                <td style="cursor: move;">
                  <v-icon class="handle">mdi-drag</v-icon>
                </td>
                <td>
                  {{ index + 1 }}
                </td>
                <td>
                  <plan-id-template :planid="item.planid" />
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
                <td>
                  <plan-start-template :datetime="item.scheduledstart" />
                </td>
                <td>
                  <plan-actions-template
                    listType="reorder"
                    :plan="item"
                  />
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
import {
  mapState, mapActions, mapGetters,
} from 'vuex';
import Draggable from 'vuedraggable';
import PlanningLoading from './PlanningLoading.vue';
import PlanningError from './PlanningError.vue';
import PlanningNoRecords from './PlanningNoRecords.vue';
import PlanIdTemplate from './data-table/PlanIdTemplate.vue';
import PlanActionsTemplate from './data-table/PlanActionsTemplate.vue';
import PlanStartTemplate from './data-table/PlanStartTemplate.vue';

export default {
  name: 'ReorderPlanList',
  components: {
    Draggable,
    PlanningLoading,
    PlanningError,
    PlanningNoRecords,
    PlanIdTemplate,
    PlanActionsTemplate,
    PlanStartTemplate,
  },
  data() {
    return {
      headers: [
        { text: '', value: 'drag' },
        {
          text: this.$t('planning.executionOrder'),
          value: 'sortindex',
          width: '5%',
        },
        { text: this.$t('planning.plan'), value: 'planid' },
        {
          text: this.$t('planning.part'),
          value: 'partname',
          width: '25%',
        },
        {
          text: this.$t('planning.equipment'),
          value: 'equipmentname',
          width: '25%',
        },
        {
          text: this.$t('planning.plannedQty'),
          value: 'plannedquantity',
        },
        { text: this.$t('planning.planStart'), value: 'scheduledstart' },
        {
          text: this.$t('planning.action'),
          value: 'action',
          sortable: false,
          width: '15%',
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
    ...mapActions('productionPlanning', [
      'fetchReorderPlanList',
      'updatePlanByPlanId',
    ]),
    async updateExecutionOrder(evt) {
      const { moved } = evt;
      const { newIndex } = moved;
      const { planid, machinename } = moved.element;
      const plans = this.notStartedPlans[machinename].values;
      const end = plans[newIndex].sortindex;
      let newSortIndex = 0;
      if (newIndex === 0) {
        newSortIndex = Math.ceil(end / 2);
      } else if (newIndex === plans.length - 1) {
        newSortIndex = end + 100;
      } else {
        const start = plans[newIndex - 1].sortindex;
        newSortIndex = Math.ceil((start + end) / 2);
      }
      await this.updatePlanByPlanId({
        planId: planid,
        payload: { sortindex: newSortIndex },
        listType: 'reorder',
      });
    },
  },
  created() {
    this.fetchReorderPlanList();
  },
};
</script>
