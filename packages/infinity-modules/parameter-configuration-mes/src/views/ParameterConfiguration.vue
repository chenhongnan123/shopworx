<template>
  <div>
    <portal to="app-header">
      {{ $t('parameterConfiguration') }}
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
    <template>
      <parameter-schedule-view/>
      <!-- <v-fade-transition mode="out-in">
        <parameter-schedule-view v-if="parameterView === 0" /> -->
        <!-- <plc-datatypes v-else-if="parameterView === 1" />
        <plc-category v-else-if="parameterView === 2" /> -->
      <!-- </v-fade-transition> -->
    </template>
  </div>
</template>

<script>
import ParameterScheduleView from './ParameterScheduleView.vue';
// import PlcDatatypes from './PlcDatatypes.vue';
// import PlcCategory from './PlcCategory.vue';

export default {
  name: 'ParameterConfiguration',
  components: {
    ParameterScheduleView,
    // PlcDatatypes,
    // PlcCategory,
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
    // this.setExtendedHeader(true);
    this.loading = false;
  },
  methods: {
    // ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
