<template>
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        Production filters
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <v-autocomplete
            class="mt-5"
            :items="sublines"
            outlined
            dense
            hide-details
            v-model="selectedSubLine"
            name="name"
            label="Select Subline"
            item-text="name"
            item-value="id"
            clearable
            return-object
            @change="getMachineBySubline"
          >
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="machineBySubline"
            outlined
            dense
            hide-details
            v-model="selectedMachine"
            name="name"
            label="Select Machine"
            item-text="name"
            item-value="id"
            clearable
          >
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions class="mt-10">
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :loading="saving"
        >
          Apply
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ProductionFilter',
  created() {},
  data() {
    return {
      saving: false,
      loading: false,
      selectedSubLine: null,
      selectedMachine: null,
    };
  },
  computed: {
    ...mapState('productionLayoutSF', [
      'filter',
      'lines',
      'sublines',
      'sublineByline',
      'machineBySubline',
      'selectedLine',
    ]),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('productionLayoutSF', ['setFilter', 'toggleFilter']),
    ...mapActions('productionLayoutSF', [
      'getfilteredSubline',
      'getfilteredMachine',
      'getSublines',
      'getMachines',
    ]),
    getMachineBySubline() {
      this.getfilteredMachine(`?query=sublineid=="${this.selectedSubLine.id}"`);
    },
    async btnApply() {
      if (this.selectedSubLine && !this.selectedMachine) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
      } else if (this.selectedSubLine && this.selectedMachine) {
        const querySubline = `?query=id=="${this.selectedSubLine.id}"`;
        await this.getSublines(querySubline);
        const querymachine = `?query=sublineid=="${this.selectedSubLine.id}"%26%26id=="${this.selectedMachine}"`;
        await this.getMachines(querymachine);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_INPUT',
        });
      }
    },
    async btnReset() {
      this.toggleFilter();
      this.selectedSubLine = '';
      this.selectedMachine = '';
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getMachines('');
    },
  },
};
</script>
