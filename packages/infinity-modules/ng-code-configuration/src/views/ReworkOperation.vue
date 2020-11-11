<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>NG-Codes</span>
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
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <ng-code-config/>
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import NgCodeConfig from './NgCodeConfig.vue';

export default {
  name: 'ProductionLog',
  components: {
    NgCodeConfig,
  },
  data() {
    return {
      reworkView: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState('reworkOperation', ['lines', 'sublines']),
  },
  async created() {
    this.loading = true;
    this.reworkView = 0;
    this.setExtendedHeader(true);
    this.loading = false;
    const success = await this.getLines();
    if (success) {
      [this.selectedLine] = this.lines;
    }
    this.setSublines([]);
    await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
    await this.getSubStations('');
    await this.getroadMapsList('');
  },
  methods: {
    ...mapActions('reworkOperation', ['getLines', 'getSublines', 'getSubStations', 'getroadMapsList']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapMutations('reworkOperation', [
      'setLines',
      'setSublines',
      'setSubStations',
      'setroadMapsList',
    ]),
  },
};
</script>
