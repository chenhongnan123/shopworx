<template>
  <v-responsive max-height="274" min-height="274" min-width="411">
    <v-card
      flat
      outlined
      class="flex"
      height="100%"
      rounded="lg"
      v-if="machine"
      dark
      :color="`${color} darken-2`"
    >
      <v-card-title class="headline font-weight-medium justify-space-between pb-0">
        <div>
          {{ machine.machinename }}
        </div>
      </v-card-title>
      <div v-if="machine.production.length" class="px-4">
        <div v-for="(prod, n) in machine.production" :key="n">
          <div
            :class="`d-inline-block text-truncate
              pt-2 title font-weight-regular ${color}--text text--lighten-4`"
            style="max-width: 65%"
          >
            {{ prod.partname }}
          </div>
          <span class="float-right">
            <span :class="`display-1 ${color}--text text--lighten-4 font-weight-medium`">
              {{ prod.produced }}</span>
              <span :class="`title ${color}--text text--lighten-4`">/{{ prod.target }}</span>
          </span>
          <v-progress-linear
            :color="`${color} lighten-2`"
            :value="(prod.produced/prod.target)* 100"
          ></v-progress-linear>
        </div>
      </div>
      <div
        v-if="machine.machinestatus === 'DOWN'"
        :class="`${color}--text text--lighten-4`"
        style="position: absolute; bottom: 0;"
      >
        <span
          class="text-truncate mt-3"
          style="max-width: 65%"
        >
          {{ machine.downreason }}
        </span>
        <span class="float-right">
          {{ machine.downsince }}
        </span>
      </div>
    </v-card>
  </v-responsive>
</template>

<script>
export default {
  name: 'AssetCard',
  props: {
    machine: {
      type: Object,
    },
  },
  inject: ['theme'],
  computed: {
    color() {
      let color = '';
      if (this.machine) {
        const { machinestatus } = this.machine;
        if (machinestatus === 'UP') {
          color = 'success';
        } else if (machinestatus === 'DOWN') {
          color = 'error';
        } else if (machinestatus === 'NOPLAN') {
          color = 'warning';
        }
      }
      return color;
    },
    backgroundShade() {
      const { isDark } = this.theme;
      if (isDark) {
        return 'darken';
      }
      return 'lighten';
    },
    textShade() {
      const { isDark } = this.theme;
      if (isDark) {
        return 'lighten';
      }
      return 'darken';
    },
  },
};
</script>
