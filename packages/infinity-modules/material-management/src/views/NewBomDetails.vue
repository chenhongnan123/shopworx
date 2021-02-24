<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>BOM Details</span>
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
    <v-container fluid class="py-0">
      <v-btn icon @click="$router.push({ name: 'materialManagement' })">
      <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>BOM Name: {{query.name}}</span>
      <span></span>
      <v-tabs
        dense
        center-active
        v-model="bomView"
      >
        <v-tab class="text-none">
          Structure
        </v-tab>
        <v-tab class="text-none">
          Configuration
        </v-tab>
      </v-tabs>
    <!-- <recipe-filter></recipe-filter> -->
    <template>
      <v-fade-transition mode="out-in">
          <structure-bom-details v-if="bomView === 0" :query="query"/>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
          <configuration-bom-details-old v-if="bomView === 1" :query="query"/>
      </v-fade-transition>
    </template>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import StructureBomDetails from './StructureBomDetails.vue';
import ConfigurationBomDetailsOld from './ConfigurationBomDetailsOld.vue';

export default {
  name: 'newBomDetails',
  components: {
    StructureBomDetails,
    ConfigurationBomDetailsOld,
  },
  data() {
    return {
      query: {},
    };
  },
  created() {
    this.bomView = 0;
    this.query = {
      id: this.id,
      name: this.name,
      lineid: this.lineid,
    };
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapMutations('bomManagement', ['setbomViewState']),
  },
  computed: {
    ...mapState('bomManagement', [
      'bomViewState',
    ]),
    bomView: {
      get() {
        return this.bomViewState;
      },
      set(val) {
        this.setbomViewState(val);
      },
    },
  },
  props: ['id', 'name', 'lineid'],
};
</script>
<style>
  .tableContainer .v-select{
    height: 30px;
  }
  .tableContainer .v-input__slot{
    width: 150px;
  }
  .tableContainer .v-text-field.v-text-field--solo.v-input--dense > .v-input__control{
    min-height: 30px;
  }
</style>
