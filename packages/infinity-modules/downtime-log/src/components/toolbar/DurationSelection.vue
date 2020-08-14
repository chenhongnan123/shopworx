<template>
  <v-menu
    bottom
    offset-y
  >
    <template #activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        <v-icon small left v-text="'$downtimeLog'"></v-icon>
        {{ durationList.find((duration) => duration.value === selectedDuration.value).name }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(duration, n) in durationList"
        @click="setSelectedDuration(duration)"
      >
        <v-list-item-title>{{ duration.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {
  mapMutations,
  mapState,
  mapActions,
} from 'vuex';

export default {
  name: 'DurationSelection',
  data() {
    return {
      durationList: [{
        name: '> 1 min',
        value: 60,
      }, {
        name: '> 5 mins',
        value: 300,
      }, {
        name: '> 30 mins',
        value: 1800,
      }, {
        name: '> 60 mins',
        value: 3600,
      }, {
        name: 'All durations',
        value: 0,
      }],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['selectedDuration']),
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedDuration']),
    ...mapActions('downtimeLog', ['fetchMachines']),
  },
  created() {
    if (this.durationList && this.durationList.length) {
      if (!this.selectedDuration) {
        this.setSelectedDuration(this.durationList[0]);
      }
    } else {
      this.fetchMachines();
    }
  },
  watch: {
    durationList(val) {
      if (val && val.length) {
        if (!this.selectedDuration) {
          this.setSelectedDuration(val[0]);
        }
      }
    },
  },
};
</script>
