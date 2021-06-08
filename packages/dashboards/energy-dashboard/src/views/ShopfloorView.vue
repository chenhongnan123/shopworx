<template>
  <div>
    <portal to="dashboard-title">
      {{ $t(`energyDashboard.title${selectedView}`) }}
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
      <summary-layout v-if="!isTV && !isFullscreen" />
      <v-responsive :max-height="cHeight" :min-height="cHeight">
        <v-window
          v-model="window"
          v-if="screens"
          style="height: 100%"
        >
          <v-window-item
            v-for="(screenData, screen) in screens"
            :key="screen"
            style="height: 100%"
          >
            <v-row>
              <v-col
                :cols="12 / screenData.cols"
                :key="n"
                v-for="(meter, n) in screenData.meters"
              >
                <detailed-view :meter="meter" />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <perfect-scrollbar v-else>
          <v-expansion-panels
            class="mt-2"
            style="max-height: calc(100vh - 158px)"
          >
            <compact-view
              :meter="meter"
              v-for="(meter, i) in meters"
              :key="i" />
          </v-expansion-panels>
        </perfect-scrollbar>
      </v-responsive>
      <summary-layout v-if="isTV || isFullscreen" />
      <v-footer padless fixed v-if="!isTV && !isFullscreen && screens">
        <v-col
          class="text-center py-1"
          cols="12"
        >
          <v-btn
            icon
            small
            class="d-inline-block mr-4"
            @click="prev"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-item-group
            v-model="window"
            class="text-center d-inline-block"
            mandatory
            v-if="$vuetify.breakpoint.smAndUp"
          >
            <v-item
              v-for="n in totalScreens"
              :key="`btn-${n}`"
              #default="{ active }"
            >
              <v-btn
                :input-value="active"
                icon
                small
                @click="toggle(n)"
              >
                <v-icon small>mdi-record</v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
          <v-btn
            icon
            small
            class="d-inline-block ml-4"
            @click="next"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-footer>
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
        {{ $t(`energyDashboard.title${selectedView}`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="headline font-weight-medium">
        {{ now }} | {{ currentShift }}
      </span>
    </v-app-bar>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import SummaryLayout from '../components/SummaryLayout.vue';
import CompactView from '../components/asset-card/CompactView.vue';
import DetailedView from '../components/asset-card/DetailedView.vue';

export default {
  name: 'ShopfloorView',
  components: {
    SummaryLayout,
    CompactView,
    DetailedView,
  },
  inject: ['theme'],
  data() {
    return {
      window: 0,
      now: null,
      interval: null,
      cHeight: window.innerHeight,
      cWidth: window.innerWidth,
    };
  },
  mounted() {
    this.onResize();
  },
  computed: {
    ...mapGetters('energyDashboard', ['screens']),
    ...mapGetters('helper', ['isTV']),
    ...mapState('helper', ['isFullscreen']),
    ...mapState('energyDashboard', [
      'currentShift',
      'selectedView',
      'meters',
      'currentTime',
    ]),
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
    totalScreens() {
      return this.screens ? Object.keys(this.screens).length : 0;
    },
  },
  methods: {
    ...mapMutations('energyDashboard', ['setRows', 'setCols']),
    onResize() {
      if (this.isTV || this.isFullscreen) {
        this.cHeight = window.innerHeight - 168;
      } else if (this.$vuetify.breakpoint.xsOnly) {
        this.cHeight = window.innerHeight - 158;
      } else {
        this.cHeight = window.innerHeight - 168 - 36;
      }
      this.cWidth = window.innerWidth;
      const rows = Math.floor(this.cHeight / (274 + 14));
      this.setRows(rows);
      const cols = Math.floor(this.cWidth / (510 + 14));
      this.setCols(cols);
    },
    next() {
      if (this.window + 1 === this.totalScreens) {
        this.window = 0;
      } else {
        this.window += 1;
      }
    },
    prev() {
      if (this.window - 1 < 0) {
        this.window = this.totalScreens - 1;
      } else {
        this.window -= 1;
      }
    },
    toggle(val) {
      this.window = val - 1;
    },
  },
  created() {
    const self = this;
    this.interval = setInterval(() => {
      if (self.isFullscreen || self.isTV) {
        self.next();
      }
    }, 10000);
    if (this.currentTime) {
      this.now = formatDate(this.currentTime, 'HH:mm');
    }
  },
  watch: {
    currentTime(val) {
      this.now = formatDate(val, 'HH:mm');
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
