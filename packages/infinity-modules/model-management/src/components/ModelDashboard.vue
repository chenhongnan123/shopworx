<template>
  <v-container fluid>
    <widget-add-drawer />
    <grid-layout
      :layout.sync="dashboardWidgets"
      :col-num="12"
      :row-height="30"
      :is-draggable="customizeMode"
      :is-resizable="false"
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
          :is="widget.definition.component"
        />
      </grid-item>
    </grid-layout>
    <!-- <v-row>
      <v-col cols="12" lg="6" xl="5">
        <v-row>
          <v-col cols="12" class="pt-0">
            <model-info />
          </v-col>
          <v-col cols="12">
            <model-warnings />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6" xl="7">
        <model-output />
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import VueGridLayout from 'vue-grid-layout';
import WidgetAddDrawer from './dashboard/WidgetAddDrawer.vue';
import ModelInfo from './widgets/ModelInfo.vue';
import ModelOutput from './widgets/ModelOutput.vue';
import ModelWarnings from './widgets/ModelWarnings.vue';

export default {
  name: 'ModelDashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    WidgetAddDrawer,
    ModelInfo,
    ModelOutput,
    ModelWarnings,
  },
  computed: {
    ...mapState('modelManagement', ['widgets', 'customizeMode']),
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
    ...mapMutations('modelManagement', ['setWidgets']),
    deleteWidget(val) {
      const index = this.dashboardWidgets.findIndex((widget) => widget.i === val);
      this.dashboardWidgets.splice(index, 1);
    },
  },
};
</script>
