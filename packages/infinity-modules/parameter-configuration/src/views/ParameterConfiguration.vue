<template>
  <div>
    <portal to="app-header">
      Parameter Configuration
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal
      to="app-extension"
    >
      <v-tabs
        dense
        center-active
        v-model="parameterView"
      >
        <v-tab class="text-none">
          Add parameters
        </v-tab>
        <v-tab class="text-none">
          PLC datatypes
        </v-tab>
      </v-tabs>
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <parameter-schedule-view v-if="parameterView === 0" />
        <plc-datatypes v-else-if="parameterView === 1" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ParameterScheduleView from './ParameterScheduleView.vue';
import PlcDatatypes from './PlcDatatypes.vue';

export default {
  name: 'ParameterConfiguration',
  components: {
    ParameterScheduleView,
    PlcDatatypes,
  },
  data() {
    return {
      parameterView: 0,
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.parameterView = 0;
    this.setExtendedHeader(true);
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
