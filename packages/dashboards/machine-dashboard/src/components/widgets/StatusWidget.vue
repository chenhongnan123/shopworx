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
        <div class="display-2 white--text">
          {{ assetState.shift }} |
          {{ running
            ? $t('shopfloorDashboard.up')
            : $t('shopfloorDashboard.down') }}
        </div>
        <div class="headline" v-if="assetState && assetState.actualdowntimestart && !running">
          {{ getDowntimeSince(assetState.actualdowntimestart) }}
        </div>
        <div class="title mt-2">
          Last updated at: {{ new Date(assetState.updatedAt).toLocaleString('en-GB') }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';
import { mapGetters } from 'vuex';

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
  computed: {
    title() {
      return this.widget && this.widget.definition.title;
    },
    machine() {
      return this.$route.params.id;
    },
    ...mapGetters('machineDashboard', ['realTimeValue']),
    assetState() {
      const val = this.realTimeValue(this.machine);
      if (Object.keys(val).length > 0) {
        const key = Object.keys(val)[0];
        return val[key];
      }
      return null;
    },
    running() {
      return this.assetState && this.assetState.status !== 'inProgress';
    },
  },
  methods: {
    getDowntimeSince(datetime) {
      return `since ${distanceInWordsToNow(
        new Date(datetime),
      )}`;
    },
  },
};
</script>
