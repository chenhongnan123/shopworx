<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <portal to="app-header">Production Layout</portal>
        <v-row class="mt-2">
          <v-col cols="2" md="2" lg="2">
            <v-select
              label="Line"
              :items="lines"
              item-text="name"
              return-object
              v-model="selectedLine"
              @change="onLineChange"
            >
            </v-select>
          </v-col>
          <template v-if="selectedLine">
            <v-col cols="2" md="2" lg="2">
              <v-text-field label="Line Name" v-model="selectedLine.name" readonly></v-text-field>
            </v-col>
            <v-col cols="2" md="2" lg="2">
              <v-text-field
                label="Line Description"
                v-model="selectedLine.description"
              ></v-text-field>
            </v-col>
          </template>
        </v-row>
        <v-row class="mb-6" no-gutters>
          <div style="float:right">
            <v-spacer></v-spacer>
            <SelectedLineUpdate />
            <AddLine />
            <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
            <ProductionFilter />
          </div>
        </v-row>
        <v-row class="mb-6" v-if="selectedLine" no-gutters>
          <v-col>
            <v-card class="pa-2" tile outlined>
              Subline
              <AddSubline :lineid="selectedLine.id" />
            </v-card>
          </v-col>
          <v-col>
            <v-card class="pa-2" tile outlined>
              Machine
              <AddMachine :lineid="selectedLine.id" :linename="selectedLine.name" />
            </v-card>
          </v-col>
        </v-row>
        <v-row class="pa-1 mx-1 grid_row" :key="subline._id" v-for="subline in sublines">
          <v-col cols="6" md="6" lg="6" class="py-0">
            <div>
              {{ subline.name }}
              <DeleteSubline :subline="subline" />
              <UpdateSubline :subline="subline" :lineid="selectedLine.id" />
            </div>
          </v-col>
          <v-col cols="6" md="6" lg="6" class="py-0">
            <v-row
              :key="machine._id"
              v-for="machine in machines.filter((s) => subline.id === s.sublineid)"
            >
              <v-col cols="4" md="4" lg="4" class="py-0">
                <div class="pl-2">
                  {{ machine.machinename }}
                  <DeleteMachine :machine="machine" />
                  <UpdateMachine :machine="machine" />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import AddSubline from '../components/AddSubline.vue';
import AddMachine from '../components/AddMachine.vue';
import AddLine from '../components/AddLine.vue';
import UpdateSubline from '../components/UpdateSubline.vue';
import UpdateMachine from '../components/UpdateMachine.vue';
import DeleteSubline from '../components/DeleteSubline.vue';
import DeleteMachine from '../components/DeleteMachine.vue';
import SelectedLineUpdate from '../components/SelectedLineUpdate.vue';
import ProductionFilter from '../components/ProductionFilter.vue';

export default {
  name: 'ProductionLayout',
  components: {
    AddLine,
    AddSubline,
    AddMachine,
    UpdateSubline,
    UpdateMachine,
    DeleteSubline,
    DeleteMachine,
    SelectedLineUpdate,
    ProductionFilter,
  },
  data() {
    return {
      dialog: false,
      isActive: 2,
      hasError: 4,
      headersProductionLayout: [
        {
          text: 'Subline',
          value: 'subline',
        },
        {
          text: 'Machine',
          value: 'machine',
        },
      ],
      loading: false,
      selectedLine: null,
      selectedMachine: null,
    };
  },
  computed: {
    ...mapState('productionLayoutSF', ['lines', 'machines', 'sublines']),
  },
  async created() {
    const success = await this.getLines();
    if (success) {
      [this.selectedLine] = this.lines;
      await this.onLineChange();
    }
  },
  methods: {
    ...mapActions('productionLayoutSF', ['getLines', 'getMachines', 'getSublines']),
    ...mapMutations('productionLayoutSF', [
      'setSublines',
      'setMachines',
      'setSelectedLine',
      'toggleFilter',
    ]),
    setMachine(machine) {
      this.selectedMachine = machine;
    },
    async onLineChange() {
      this.setSublines([]);
      this.setMachines([]);
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getMachines('');
      this.setSelectedLine(this.selectedLine);
    },
  },
};
</script>
<style scoped>
div .pa-1:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: #454d55;
  border-bottom: 1px solid rgba(243, 243, 247, 0.25);
}
div .pa-1:nth-of-type(even) {
  border-color: #454d55;
  border-bottom: 1px solid rgba(243, 243, 247, 0.25);
}
.row .pa-1:nth-of-type(odd) {
  border-bottom: 1px solid rgba(198, 198, 212, 0.35);
}
.row .pa-1:nth-of-type(even) {
  border-bottom: 1px solid rgba(198, 198, 212, 0.35);
}
.theme--light.v-application .row .pa-1:nth-of-type(odd) {
  background-color: #f5f5f5;
}
.my-text-style {
  color: red;
}
.green--text {
  color: green;
}
</style>
