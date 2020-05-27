<template>
  <div>
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <span
        class="title font-weight-regular"
        v-text="'Plans yet to start'"
      ></span>
      <span class="caption ml-2">
        (Sorted by execution order)
      </span>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('refresh-widget')">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
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
          v-else-if="notStartedPlans.length === 0"
        >
          No plans...
        </v-card-text>
        <v-card-text
          v-else
          class="pa-0"
        >
          <v-list class="py-0">
            <template v-for="(plan, i) in plans">
              <v-list-item :key="i">
                <v-list-item-avatar>
                  <v-icon>mdi-drag</v-icon>
                </v-list-item-avatar>
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
                      <v-list-item-subtitle>
                        {{ getScheduledStart(plan) }}
                      </v-list-item-subtitle>
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
import { mapActions, mapState } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'UpcomingProduction',
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
    ...mapState('productionLog', ['notStartedPlans']),
    plans() {
      if (this.notStartedPlans) {
        const items = Object
          .keys(this.notStartedPlans)
          .map((planId) => {
            const plans = this.notStartedPlans[planId];
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
    ...mapActions('productionLog', ['getNotStartedPlans']),
    async fetchPlans() {
      this.loading = true;
      await this.getNotStartedPlans();
      this.loading = false;
    },
    getScheduledStart(plan) {
      return `Scheduled start ${distanceInWordsToNow(
        new Date(plan.scheduledstart),
        { addSuffix: true },
      )}`;
    },
  },
};
</script>
