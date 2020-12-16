<template>
  <div>
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
                v-for="(machine, n) in screenData.machines"
              >
                <asset-card :machine="machine" />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-responsive>
      <summary-layout v-if="isTV || isFullscreen" />
      <v-footer padless fixed v-if="!isTV && !isFullscreen">
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
            v-if="$vuetify.breakpoint.mdAndUp"
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
        Shift-wise shopfloor dashboard
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
import AssetCard from '../components/AssetCard.vue';

export default {
  name: 'ShopfloorView',
  components: {
    SummaryLayout,
    AssetCard,
  },
  inject: ['theme'],
  data() {
    return {
      window: 0,
      now: null,
      interval: null,
      timeInterval: null,
      cHeight: window.innerHeight,
      cWidth: window.innerWidth,
    };
  },
  mounted() {
    this.onResize();
  },
  computed: {
    ...mapGetters('shopfloor', ['screens']),
    ...mapGetters('helper', ['isTV']),
    ...mapState('helper', ['isFullscreen']),
    ...mapState('shopfloor', ['currentShift']),
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
    ...mapMutations('shopfloor', ['setRows', 'setCols']),
    onResize() {
      if (!this.isTV && !this.isFullscreen) {
        this.cHeight = window.innerHeight - 168 - 36;
      } else {
        this.cHeight = window.innerHeight - 168;
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
    this.timeInterval = setInterval(() => {
      self.now = formatDate(new Date().getTime(), 'HH:mm');
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);
  },
};
</script>
