<template>
  <grid-layout
    :layout.sync="dashboardWidgets"
    :col-num="12"
    id="maintenance-summary"
    :row-height="30"
    :is-draggable="customizeMode"
    :is-resizable="customizeMode"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[14, 14]"
    :responsive="true"
    :use-css-transforms="true"
    :class="[
      $vuetify.theme.dark ? '#121212' : 'white',
    ]"
  >
    <grid-item
      v-for="(widget, index) in dashboardWidgets"
      :key="index"
      :x="widget.x"
      :y="widget.y"
      :w="widget.w"
      :h="widget.h"
      :i="widget.i"
      :minW="widget.definition.minWidth"
      :minH="widget.definition.minHeight"
      :maxW="widget.definition.maxWidth"
      :maxH="widget.definition.maxHeight"
    >
      <component
        :widget="widget"
        @remove-widget="deleteWidget"
        @save-config="updateConfig($event, widget)"
        :customizeMode="customizeMode"
        :is="widget.definition.component"
      />
    </grid-item>
  </grid-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VueGridLayout from 'vue-grid-layout';
import SummaryWidget from './widgets/SummaryWidget.vue';
import PlanWidget from './widgets/PlanWidget.vue';

export default {
  name: 'DetailDashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    SummaryWidget,
    PlanWidget,
  },
  computed: {
    ...mapState('maintenanceSummary', ['widgets', 'customizeMode']),
    dashboardWidgets: {
      get() {
        return this.widgets;
      },
      set(val) {
        this.setWidgets(val);
      },
    },
  },
  methods: {
    ...mapMutations('maintenanceSummary', ['setWidgets']),
    deleteWidget(val) {
      const index = this.dashboardWidgets.findIndex((widget) => widget.i === val);
      this.dashboardWidgets.splice(index, 1);
    },
    updateConfig(payload, widget) {
      const index = this.dashboardWidgets.find((w) => w.i === widget.i);
      const newWidget = { ...widget };
      newWidget.definition.config = { ...payload.config };
      newWidget.definition.configured = payload.configured;
      this.dashboardWidgets[index] = { ...newWidget };
    },
  },
};
</script>
