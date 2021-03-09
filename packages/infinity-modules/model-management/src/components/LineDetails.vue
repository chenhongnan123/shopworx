<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-card
          tile
          outlined
          class="pa-2"
        >
          Subline
        </v-card>
      </v-col>
      <v-col>
        <v-card
          tile
          outlined
          class="pa-2"
        >
          Station
        </v-card>
      </v-col>
      <v-col>
        <v-card
          tile
          outlined
          class="pa-2"
        >
          Substation
        </v-card>
      </v-col>
      <v-col>
        <v-card
          tile
          outlined
          class="pa-2"
        >
          Subprocess (Select one)
        </v-card>
      </v-col>
    </v-row>
    <div v-if="fetchingLineDetails" class="text-center">
      <v-progress-linear :indeterminate="true"></v-progress-linear>
      <div class="mt-2">Fetching line details...</div>
    </div>
    <template v-else>
      <v-row
        class="pa-1 mx-1"
        v-for="subline in lineDetails"
        :key="subline.id"
      >
        <v-col cols="3" class="py-0">
          {{ subline.name }}
        </v-col>
        <v-col cols="9" class="py-0">
          <v-row
            v-for="station in subline.stations"
            :key="station.id"
          >
            <v-col cols="4" class="py-0">
              {{ station.name }}
            </v-col>
            <v-col cols="8" class="py-0">
              <v-row
                v-for="substation in station.substations"
                :key="substation.id"
              >
                <v-col cols="6" class="py-0 pl-4">
                  {{ substation.name }}
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-row
                    v-for="process in substation.processes"
                    :key="process.id"
                  >
                    <v-col cols="12" class="py-0 pl-6">
                      <v-btn
                        small
                        color="primary"
                        :disabled="fetchingModels || fetchingMaster"
                        class="text-none ma-0 pa-0"
                        @click="setSelected({
                          subline,
                          station,
                          substation,
                          process,
                        })"
                        :text="selectedProcess !== process.id"
                      >
                        {{ process.name }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'LineDetails',
  computed: {
    ...mapState('modelManagement', [
      'selectedLine',
      'selectedProcess',
      'lineDetails',
      'fetchingLineDetails',
      'fetchingModels',
      'fetchingMaster',
    ]),
  },
  created() {
    this.fetchLineDetails();
  },
  methods: {
    ...mapMutations('modelManagement', [
      'setSelectedSubline',
      'setSelectedStation',
      'setSelectedStationName',
      'setSelectedSubstation',
      'setSelectedSubstationName',
      'setSelectedProcess',
      'setSelectedProcessName',
      'setFetchingMaster',
    ]),
    ...mapActions('modelManagement', [
      'fetchLineDetails',
      'getModels',
      'getInputParameters',
      'getCriticalParameters',
      'getOutputTransformations',
    ]),
    async setSelected({
      subline,
      station,
      substation,
      process,
    }) {
      this.setSelectedSubline(subline.id);
      this.setSelectedStation(station.id);
      this.setSelectedStationName(station.name);
      this.setSelectedSubstation(substation.id);
      this.setSelectedSubstationName(substation.name);
      this.setSelectedProcess(process.id);
      this.setSelectedProcessName(process.name);
      this.setFetchingMaster(true);
      await this.getModels();
      await Promise.all([
        this.getInputParameters(),
        this.getOutputTransformations(),
        this.getCriticalParameters(),
      ]);
      this.setFetchingMaster(false);
    },
  },
  watch: {
    selectedLine() {
      this.fetchLineDetails();
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
</style>
