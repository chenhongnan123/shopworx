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
        <div class="primary--text" v-if="component === 'status-view'">
          {{ getPlanStatus(groupKey).text }}
        </div>
        <div class="primary--text" v-else>
          {{ groupKey }}
        </div>
        <component :is="component" :items="groupData.values" />
      </div>
    </template>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
} from 'vuex';
import PlanningLoading from '../PlanningLoading.vue';
import PlanningError from '../PlanningError.vue';
import PlanningNoRecords from '../PlanningNoRecords.vue';
import MachineView from '../data-table/MachineView.vue';
import PartView from '../data-table/PartView.vue';
import StatusView from '../data-table/StatusView.vue';

export default {
  name: 'PlanningList',
  components: {
    PlanningLoading,
    PlanningError,
    PlanningNoRecords,
    MachineView,
    PartView,
    StatusView,
  },
  computed: {
    ...mapState('productionPlanning', [
      'loading',
      'error',
    ]),
    ...mapGetters('productionPlanning', ['planning', 'planStatus']),
    ...mapGetters('webApp', ['group']),
    component() {
      const [key] = this.group;
      let component = '';
      if (key === 'machinename') {
        component = 'machine-view';
      } else if (key === 'partname') {
        component = 'part-view';
      } else if (key === 'status') {
        component = 'status-view';
      }
      return component;
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchPlanningList']),
    getPlanStatus(status) {
      return this.planStatus(status);
    },
  },
  created() {
    this.fetchPlanningList();
  },
};
</script>
