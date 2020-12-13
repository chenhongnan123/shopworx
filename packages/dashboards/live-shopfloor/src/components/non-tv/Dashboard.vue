<template>
  <v-row>
    <v-col v-for="(machine, n) in machines" :key="n" cols="4">
      <v-responsive max-height="226" min-height="226" min-width="411">
        <v-card
          flat
          outlined
          class="flex"
          height="100%"
          rounded="lg"
          color="warning darken-2"
        >
          <v-card-title class="headline font-weight-medium justify-space-between pb-0">
            <div>
              {{ machine.machinename }}
            </div>
          </v-card-title>
          <div v-if="machine.production.length" class="px-4">
            <div v-for="(prod, n) in machine.production" :key="n">
              <div
                class="d-inline-block text-truncate mt-3 warning--text text--lighten-4"
                style="max-width: 65%"
              >
                {{ prod.partname }}
              </div>
              <span class="float-right">
                <span class="display-1 warning--text text--lighten-4">
                  {{ prod.produced }}</span>/{{ prod.target }}
              </span>
              <v-progress-linear
                color="warning lighten-2"
                :value="(prod.produced/prod.target)* 100"
              ></v-progress-linear>
            </div>
          </div>
          <div
            v-if="machine.machinestatus === 'DOWN'"
            class="warning--text text--lighten-4"
            style="position: absolute; bottom: 0;"
          >
            <span
              class="text-truncate mt-3"
              style="max-width: 65%"
            >
              {{ machine.downreason }}
            </span>
            <span class="float-right">
              {{ machine.downsince }}
            </span>
          </div>
        </v-card>
      </v-responsive>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'NonTvDashboard',
  computed: {
    ...mapState('shopfloor', ['machines']),
  },
};
</script>
