<template>
  <v-row>
    <v-col v-for="(machine, n) in machines" :key="n" cols="4">
      <v-responsive max-height="492" min-height="492">
        <v-card
          flat
          outlined
          class="flex"
          height="100%"
          rounded="lg"
        >
          <v-card-title class="headline font-weight-medium justify-space-between pb-0">
            <div>
              {{ machine.machinename }}
            </div>
          </v-card-title>
          <div v-if="machine.production.length" class="px-4">
            <div v-for="(prod, n) in machine.production" :key="n">
              <div class="d-inline-block text-truncate mt-3" style="max-width: 65%">
                {{ prod.partname }}
              </div>
              <span class="float-right">
                <span class="display-1">
                  {{ prod.produced }}
                </span>
                /{{ prod.target }}
              </span>
              <v-progress-linear
                color="success lighten-2"
                :value="(prod.produced/prod.target)* 100"
              ></v-progress-linear>
              {{ new Date(prod.updatedat) }}
            </div>
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
