<template>
  <div>
    <portal to="dashboard-title">
      Process dashbaord
    </portal>
    <v-container
      grid-list-lg
      fluid
      style="height: 100%"
      ref="container"
      :class="theme.isDark ? '' : 'grey lighten-5'"
      class="py-0"
      v-resize="onResize"
    >
      <grid-layout
        :layout.sync="dashboardWidgets"
        :col-num="12"
        :row-height="36"
        :is-draggable="configDrawer"
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
    </v-container>
    <v-app-bar
      flat
      v-if="isTV || isFullscreen"
      :color="theme.isDark ? '#121212' : 'grey lighten-5'"
    >
      <img
        :src="require(`@shopworx/assets/logo/${shopworxLogo}.png`)"
        contain
        class="mb-3"
        height="38"
      />
      <v-toolbar-title
        :class="$vuetify.breakpoint.mdAndUp
          ? 'headline font-weight-medium ml-4'
          : 'title pl-0'"
      >
        Process dashboard
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="headline font-weight-medium">
        {{ now }} | {{ currentShift }}
      </span>
    </v-app-bar>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
import { mapMutations, mapGetters, mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import ModelInfo from '../components/widgets/ModelInfo.vue';
import ModelOutput from '../components/widgets/ModelOutput.vue';
import ModelWarnings from '../components/widgets/ModelWarnings.vue';

export default {
  name: 'ShopfloorView',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    ModelInfo,
    ModelOutput,
    ModelWarnings,
  },
  inject: ['theme'],
  data() {
    return {
      now: null,
      timeInterval: null,
      rowHeight: window.innerHeight,
    };
  },
  created() {
    const self = this;
    this.timeInterval = setInterval(() => {
      self.now = formatDate(new Date().getTime(), 'HH:mm');
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  computed: {
    ...mapGetters('helper', ['isTV']),
    ...mapState('helper', ['isFullscreen', 'configDrawer']),
    ...mapState('processDashboard', ['widgets']),
    ...mapState('processDashboard', ['currentShift']),
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
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
    ...mapMutations('processDashboard', ['setWidgets']),
    onResize() {
      let cHeight = 0;
      if (!this.isTV && !this.isFullscreen) {
        cHeight = window.innerHeight - 168 - 36;
      } else {
        cHeight = window.innerHeight - 168;
      }
      this.rowHeight = cHeight / 4;
    },
    deleteWidget(val) {
      const index = this.dashboardWidgets.findIndex((widget) => widget.i === val);
      this.dashboardWidgets.splice(index, 1);
    },
  },
};
</script>
