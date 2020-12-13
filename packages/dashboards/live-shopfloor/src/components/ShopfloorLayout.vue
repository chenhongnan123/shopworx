<template>
  <v-responsive :max-height="cHeight" :min-height="cHeight">
    <v-container
      grid-list-lg
      fluid
      style="height: 100%"
      ref="container"
      v-resize="onResize"
    >
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
              {{ machine }}
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
  </v-responsive>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ShopfloorLayout',
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
  },
  methods: {
    ...mapMutations('shopfloor', ['setRows', 'setCols']),
    onResize() {
      const { container } = this.$refs;
      console.log(container.offsetWidth);
      console.log(container.offsetHeight);
      this.cHeight = window.innerHeight - 64;
      this.cWidth = window.innerWidth;
      const rows = Math.floor(this.cHeight / 274);
      this.setRows(rows);
      const cols = Math.floor(this.cWidth / 524);
      this.setCols(cols);
    },
  },
};
</script>
