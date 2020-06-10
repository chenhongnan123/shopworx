<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Material Management</span>
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
      v-if="onboarded"
    >
      <v-tabs
        dense
        center-active
        v-model="materialView"
      >
        <v-tab class="text-none">
          Material list
        </v-tab>
        <v-tab class="text-none">
          BOM
        </v-tab>
      </v-tabs>
    </portal>
    <material-filter></material-filter>
    <bom-filter></bom-filter>
    <add-material/>
    <add-bom/>
    <planning-loading v-if="loading" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <material-list v-if="materialView === 0" />
        <bom-List v-else-if="materialView === 1" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import MaterialList from './MaterialList.vue';
import BomList from './BOMList.vue';
import AddMaterial from '../components/AddMaterial.vue';
import AddBom from '../components/AddBom.vue';
import MaterialFilter from '../components/MaterialFilter.vue';
import BomFilter from '../components/BomFilter.vue';

export default {
  name: 'Main',
  components: {
    MaterialList,
    BomList,
    AddMaterial,
    AddBom,
    MaterialFilter,
    BomFilter,
  },
  data() {
    return {
      materialView: 0,
      loading: false,
      onboarded: true,
    };
  },
  computed: {
    ...mapState('materialManagement'),
  },
  async created() {
    this.loading = true;
    this.setExtendedHeader(true);
    const view = localStorage.getItem('materialView');
    this.materialView = view ? JSON.parse(view) : 0;
    this.setOnboarded(true);
    this.setExtendedHeader(true);
    this.loading = false;
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    materialView(val) {
      localStorage.setItem('materialView', val);
    },
  },
  methods: {
    ...mapMutations('materialManagement', ['setOnboarded']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('materialManagement', ['getPlanningElement']),
  },
};
</script>
