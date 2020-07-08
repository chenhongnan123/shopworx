<template>
  <div>
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <span
        class="title font-weight-regular"
        v-text="'Downtime'"
      ></span>
      <v-spacer></v-spacer>
      <production-toolbar />
    </v-toolbar>
    <v-card outlined>
      <v-fade-transition mode="out-in">
        <v-card-text
          class="text-center"
          v-if="loading"
        >
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-card-text>
        <v-card-text
          class="text-center"
          v-else-if="error"
        >
          Error...
        </v-card-text>
        <v-card-text
          class="text-center"
          v-else-if="plans.length === 0"
        >
          No downtime...
        </v-card-text>
        <v-card-text
          v-else
          class="pa-0"
        >
          <v-list class="py-0">
            <template v-for="(plan, i) in plans">
              <v-list-item
                :key="i"
                :style="`border-left: 6px solid var(--v-${planStatusClass(plan.status)}-base)`"
              >
                <v-list-item-content>
                  <v-row>
                    <v-col cols="12" md="6" xl="5">
                      <v-list-item-title>
                        <span v-text="plan.planid"></span>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <div v-text="plan.machinename"></div>
                        <div v-text="plan.partname"></div>
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col cols="12" md="6" xl="6" class="my-auto">
                      <v-progress-linear
                        :height="20"
                        class="mt-2"
                        color="secondary"
                        :value="plan.actualquantity || 0"
                      >
                        <span class="font-weight-medium">
                          {{plan.actualquantity || 0}}/{{plan.plannedquantity}}
                        </span>
                      </v-progress-linear>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                :key="`d-${i}`"
                v-if="i < plans.length - 1"
              ></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-fade-transition>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import ProductionToolbar from '../ProductionToolbar.vue';

export default {
  name: 'DowntimeOnDate',
  components: {
    ProductionToolbar,
  },
  data() {
    return {
      error: false,
      loading: false,
    };
  },
  created() {
    this.fetchPlans();
  },
  computed: {
    ...mapState('productionLog', ['plansOnDate']),
    ...mapGetters('planning', ['planStatusClass']),
    plans() {
      if (this.plansOnDate) {
        const items = Object
          .keys(this.plansOnDate)
          .map((planId) => {
            const plans = this.plansOnDate[planId];
            let { partname } = plans[0];
            if (plans.length > 1) {
              partname = plans
                .map((plan) => plan.partname)
                .join(', ');
            }
            return {
              ...plans[0],
              planid: planId,
              partname,
              selected: false,
            };
          });
        return items;
      }
      return [];
    },
  },
  methods: {
    ...mapActions('productionLog', ['getPlansBetweenDateRange']),
    async fetchPlans() {
      this.loading = true;
      await this.getPlansBetweenDateRange({
        min: 1589308200000,
        max: 1589370249371,
      });
      this.loading = false;
    },
  },
};
</script>
