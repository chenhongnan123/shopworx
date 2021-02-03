<template>
  <div>
    <div>
      DISPLAY
    </div>
    <v-radio-group
      dense
      disabled
      hide-details
      class="ma-0 pa-0"
      v-model="display"
    >
      <v-radio
        v-for="(display, n) in displays"
        :key="n"
        :label="display.label"
        :value="display"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DisplayType',
  data() {
    return {
      displays: [{
        label: 'Compact',
        value: 'compact',
      }, {
        label: 'Detailed',
        value: 'detailed',
      }],
    };
  },
  created() {
    if (this.queries && this.queries.display) {
      this.setDisplayFromQuery(this.queries.display);
    } else if (!this.selectedDisplay) {
      this.setDisplay(this.displays[0]);
    }
  },
  computed: {
    ...mapState('shopfloor', ['selectedDisplay']),
    queries() {
      return this.$route.query;
    },
    display: {
      get() {
        return this.selectedDisplay;
      },
      set(display) {
        this.setDisplay(display);
      },
    },
  },
  methods: {
    ...mapMutations('shopfloor', ['setSelectedDisplay']),
    setDisplayFromQuery(value) {
      const display = this.displays.find((v) => v.value === value);
      if (display) {
        this.setSelectedDisplay(display);
      } else {
        this.setDisplay(this.displays[0]);
      }
    },
    setDisplay(display) {
      const query = {
        ...this.queries,
        display: display.value,
      };
      this.$router.replace({ query });
      this.setSelectedDisplay(display);
    },
  },
};
</script>
