<template>
  <grid-layout
    :layout.sync="dashboardWidgets"
    :col-num="12"
    :row-height="30"
    :is-draggable="customizeMode"
    :is-resizable="customizeMode"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[14, 14]"
    :use-css-transforms="true"
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
import TabbedWidget from '../widgets/TabbedWidget.vue';
import StatusWidget from '../widgets/StatusWidget.vue';
import StatsWidget from '../widgets/StatsWidget.vue';
import ParameterWidget from '../widgets/ParameterWidget.vue';
import StreamWidget from '../widgets/StreamWidget.vue';
import TimelineWidget from '../widgets/TimelineWidget.vue';

export default {
  name: 'DetailDashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    TabbedWidget,
    StatusWidget,
    StatsWidget,
    ParameterWidget,
    StreamWidget,
    TimelineWidget,
  },
  computed: {
    ...mapState('machineDashboard', ['widgets', 'customizeMode']),
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
    ...mapMutations('machineDashboard', ['setWidgets']),
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
