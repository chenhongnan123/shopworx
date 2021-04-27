<template>
  <v-data-table
    :items="items"
    :headers="headers"
    hide-default-footer
    disable-pagination
    item-key="_id"
  >
    <!-- eslint-disable-next-line -->
    <template #item.status="{ item }">
      <plan-status-template :status="item.status" />
    </template>
    <!-- eslint-disable-next-line -->
    <template #item.planid="{ item }">
      <plan-id-template :planid="item.planid" />
    </template>
    <!-- eslint-disable-next-line -->
    <template #item.actualstart="{ item }">
      <span v-if="item.actualstart">
        <plan-start-template :datetime="item.actualstart" />
      </span>
      <span v-else>
        <plan-start-template :datetime="item.scheduledstart" />
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template #item.action="{ item }">
      <plan-actions-template :plan="item" />
    </template>
  </v-data-table>
</template>

<script>
import PlanStatusTemplate from './PlanStatusTemplate.vue';
import PlanIdTemplate from './PlanIdTemplate.vue';
import PlanStartTemplate from './PlanStartTemplate.vue';
import PlanActionsTemplate from './PlanActionsTemplate.vue';

export default {
  name: 'MachineView',
  components: {
    PlanStatusTemplate,
    PlanIdTemplate,
    PlanStartTemplate,
    PlanActionsTemplate,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        { text: '', value: 'status' },
        { text: this.$t('planning.plan'), value: 'planid' },
        {
          text: this.$t('planning.part'),
          value: 'partname',
          width: '20%',
        },
        {
          text: this.$t('planning.equipment'),
          value: 'equipmentname',
          width: '20%',
        },
        { text: this.$t('planning.plannedQty'), value: 'plannedquantity' },
        { text: this.$t('planning.planStart'), value: 'actualstart' },
        {
          text: this.$t('planning.action'),
          value: 'action',
          sortable: false,
          width: '15%',
        },
      ],
    };
  },
};
</script>
