<template>
  <v-window
    v-model="window"
    style="height: calc(100vh - 104px)"
    v-if="machines.length"
  >
    <template>
      <v-window-item
        v-for="n in len"
        :key="n"
        style="height: 100%"
      >
        <v-row
          :key="`r-${i}`"
          v-for="(i, rIndex) in row"
          :style="`height: calc(100vh - 104px) / ${row}%`"
        >
          <v-col v-for="(j, cIndex) in col" :key="`c-${j}`">
            <machine-card
              v-if="machines[rIndex][cIndex]"
              :machine="machines[rIndex][cIndex]"
            />
          </v-col>
        </v-row>
      </v-window-item>
    </template>
  </v-window>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import MachineCard from './MachineCard.vue';

export default {
  name: 'MachineSlides',
  components: {
    MachineCard,
  },
  data() {
    return {
      interval: null,
      evtSource: null,
    };
  },
  props: {
    row: {
      type: Number,
    },
    col: {
      type: Number,
    },
    len: {
      type: Number,
    },
  },
  created() {
    const self = this;
    this.interval = setInterval(() => {
      if (self.autorun) {
        self.next();
      }
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    ...mapState('machineDashboard', ['page', 'autorun']),
    ...mapGetters('machineDashboard', ['filteredMachines']),
    window: {
      get() {
        return this.page;
      },
      set(val) {
        this.setPage(val);
      },
    },
    machines() {
      const machineMatrix = [];
      for (let i = 0; i < this.row; i += 1) {
        machineMatrix[i] = [];
        for (let j = 0; j < this.col; j += 1) {
          machineMatrix[i][j] = null;
        }
      }
      if (this.filteredMachines && this.filteredMachines.length) {
        const from = this.page * (this.row * this.col);
        const to = ((this.page + 1) * (this.row * this.col));
        const totalMachines = this.filteredMachines.slice(from, to);
        let rowCount = -1;
        for (let i = 0; i < totalMachines.length; i += 1) {
          if (i % this.col === 0) {
            rowCount += 1;
            machineMatrix[rowCount] = [];
          }
          machineMatrix[rowCount].push(totalMachines[i]);
        }
      }
      return machineMatrix;
    },
  },
  methods: {
    ...mapMutations('machineDashboard', ['setPage']),
    next() {
      if (this.page + 1 === this.len) {
        this.setPage(0);
      } else {
        this.setPage(this.page + 1);
      }
    },
    prev() {
      if (this.page - 1 < 0) {
        this.setPage(this.len - 1);
      } else {
        this.setPage(this.page - 1);
      }
    },
  },
};
</script>
