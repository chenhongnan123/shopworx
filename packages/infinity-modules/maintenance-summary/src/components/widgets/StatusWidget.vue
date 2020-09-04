<template>
  <div v-if="widget">
    <span
      class="title font-weight-regular"
      v-if="title"
      v-text="title"
    ></span>
    <span class="float-right">
      <v-btn
        small
        color="error"
        icon
        v-if="customizeMode"
        @click="$emit('remove-widget', widget.i)"
      >
        <v-icon>mdi-minus-circle</v-icon>
      </v-btn>
    </span>
    <v-card :class="title === null ? 'mt-8' : ''" :color="running ? 'success' : 'error'">
      <v-card-text class="text-center my-auto">
        <div class="display-2 white--text">{{ running ? 'RUNNING' : 'DOWN' }}</div>
        <div class="headline">
          {{ time }}
        </div>
        <div class="headline">
          Shift 1
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'StatusWidget',
  props: {
    widget: {
      type: Object,
      default: null,
    },
    customizeMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      interval: null,
      time: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
    this.updateTime();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    title() {
      return this.widget && this.widget.definition.title;
    },
    machine() {
      return this.$route.params.id;
    },
    ...mapState('maintenanceSummary', ['assetData']),
    assetState() {
      return this.assetData && this.assetData[this.machine];
    },
    running() {
      return this.assetData && !this.assetData.isdown;
    },
  },
  methods: {
    updateTime() {
      this.time = new Date().toLocaleString();
    },
  },
};
</script>
