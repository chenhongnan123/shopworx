<template>
  <div style="height:calc(100vh - 104px)">
    <portal to="app-header">
      <span>Parameter Analysis</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1" @click="setSettingDialog(true)">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn>
    </portal>
    <portal to="app-extension" v-if="onboarded">
      <v-tabs dense center-active v-model="materialView">
        <v-tab class="text-none">
          SPC
        </v-tab>
        <v-tab class="text-none">
          CONFIGURATION
        </v-tab>
      </v-tabs>
    </portal>
    <!-- <material-filter></material-filter>
    <bom-filter></bom-filter> -->
    <!-- <planning-loading v-if="loading" /> -->
    <template>
      <v-fade-transition mode="out-in">
        <spc v-if="materialView === 0" />
        <configuration v-else-if="materialView === 1" />
      </v-fade-transition>
    </template>
    <settings-window />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
/* eslint-disable */
import spc from './SpcApp';
import configuration from './Configuration';
import SettingsWindow from '../components/SettingsWindow';

export default {
  name: 'Main',
  components: {
    spc,
    configuration,
    SettingsWindow,
  },
  data() {
    return {
      materialView: 0,
      loading: false,
      onboarded: true,
    };
  },
  computed: {
    // ...mapState('materialManagement'),
  },
  async created() {
    this.loading = true;
    this.setExtendedHeader(true);
    const view = localStorage.getItem('spcView');
    this.materialView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
    await this.initSetting();
    this.loading = false;
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    materialView(val) {
      localStorage.setItem('spcView', val);
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapMutations('spc', ['setSettingDialog']),
    ...mapActions('spc', ['initSetting']),
    ...mapActions('webApp', ['getAppSchema']),
  },
};
</script>
