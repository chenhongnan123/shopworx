<template>
  <v-container
    grid-list-lg
    fluid
    style="height: 100%"
    ref="container"
    :class="theme.isDark ? '' : 'grey lighten-5'"
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
        11:46 | Shift 2
      </span>
    </v-app-bar>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import SummaryLayout from './SummaryLayout.vue';
import AssetCard from './AssetCard.vue';

export default {
  name: 'ShopfloorLayout',
  components: {
    SummaryLayout,
    AssetCard,
  },
  inject: ['theme'],
  data() {
    return {
      window: 0,
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
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
  methods: {
    ...mapMutations('shopfloor', ['setRows', 'setCols']),
    onResize() {
      this.cHeight = window.innerHeight - 168 - 24;
      console.log(this.cHeight);
      this.cWidth = window.innerWidth;
      const rows = Math.floor(this.cHeight / (274 + 14));
      this.setRows(rows);
      const cols = Math.floor(this.cWidth / (510 + 14));
      this.setCols(cols);
    },
  },
};
</script>
