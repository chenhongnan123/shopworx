<template>
  <div>
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <span
        class="title font-weight-regular"
        v-text="'Production'"
      ></span>
      <v-spacer></v-spacer>
      <production-toolbar />
    </v-toolbar>
    <v-card flat>
      <v-fade-transition mode="out-in">
        <v-card-text
          class="text-center"
          v-if="loading"
        >
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-card-text>
        <!-- <v-card-text
          class="text-center"
          v-else-if="error"
        >
          Error...
        </v-card-text>
        <v-card-text
          class="text-center"
          v-else-if="plans.length === 0"
        >
          No production...
        </v-card-text> -->
        <v-card-text
          v-else
          class="pa-0"
        >
          <template v-for="(plan, i) in plans">
            <v-card
              :key="i"
              outlined
              class="mb-2"
              :style="`border-left: 6px solid var(--v-${planStatusClass(plan.status)}-base)`"
            >
              <v-card-title primary-title>
                {{ plan.planid }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      class="ml-2 mb-1 error--text"
                    >
                      <v-icon>
                        mdi-close-octagon-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Abort plan</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <span class="body-1 mb-2">
                  10:30 to 14:30
                </span>
              </v-card-title>
              <v-card-subtitle primary-title>
              </v-card-subtitle>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12" sm="6">
                    <div class="body-2">
                      Part
                    </div>
                    <div class="text-uppercase title font-weight-regular mb-2">
                      {{ plan.partname }}
                    </div>
                    <div class="body-2">
                      Scheduled end
                    </div>
                    <div class="text-uppercase title font-weight-regular mb-2">
                      in about 3 hours
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="warning--text">
                      <div class="body-2">
                        Produced
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2">
                        2000
                      </div>
                    </div>
                    <div class="error--text">
                      <div class="body-2">
                        Rejected
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2">
                        10
                      </div>
                    </div>
                    <div class="success--text">
                      <div class="body-2">
                        Accepted
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2">
                        1990
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="6">
                    <div class="body-2">
                      Active cavity
                    </div>
                    <div class="text-uppercase title font-weight-regular mb-2">
                      {{ plan.activecavity }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="body-2">
                      Planned quantity
                    </div>
                    <div class="text-uppercase title font-weight-regular mb-2">
                      {{ plan.plannedquantity }}
                    </div>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-expansion-panels
                  flat
                  accordion
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0 ma-0">
                      REJECTIONS
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="panel-padding">
                        <v-card flat>
                          <v-row>
                            <v-col sm="1" class="my-auto">
                              <v-icon>mdi-checkbox-blank-outline</v-icon>
                            </v-col>
                            <v-col cols="12" sm="7">
                              <v-autocomplete
                                outlined
                                dense
                                hide-details
                                return-object
                                :items="reasons"
                                item-text="name"
                                item-value="code"
                                label="Rejection reason"
                              >
                                <template #selection="data">
                                  {{ data.item.code }} | {{ data.item.name }}
                                </template>
                                <template #item="data">
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      {{ data.item.code }} | {{ data.item.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle
                                      v-text="data.item.category"
                                    ></v-list-item-subtitle>
                                    <v-list-item-subtitle
                                      v-text="data.item.department"
                                    ></v-list-item-subtitle>
                                  </v-list-item-content>
                                </template>
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-text-field
                                outlined
                                dense
                                hide-details
                                type="number"
                                label="Quantity"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="11" offset="1">
                              <v-textarea
                                outlined
                                dense
                                label="Remarks"
                              ></v-textarea>
                            </v-col>
                            <!-- <v-col cols="2">
                              <v-btn small icon class="error--text mt-2">
                                <v-icon v-text="'$delete'"></v-icon>
                              </v-btn>
                            </v-col> -->
                          </v-row>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              class="text-none"
                            >
                              <v-icon left>mdi-plus</v-icon>
                              Add new
                            </v-btn>
                            <v-btn
                              color="primary"
                              class="text-none"
                            >
                              Update rejection
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </template>
          <!-- <v-list class="py-0">
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
          </v-list> -->
        </v-card-text>
      </v-fade-transition>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import ProductionToolbar from '../ProductionToolbar.vue';

export default {
  name: 'ProductionOnDate',
  components: {
    ProductionToolbar,
  },
  data() {
    return {
      error: false,
      loading: false,
      reasons: [{
        code: 'RT-01',
        name: 'Machine breakdown',
        category: 'Breakdown',
        department: 'Production',
      }, {
        code: 'RT-02',
        name: 'Oil change',
        category: 'Maintenance',
        department: 'Maintenance',
      }, {
        code: 'RT-03',
        name: 'Power outage',
        category: 'Power',
        department: 'Management',
      }],
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
              status: 'inProgress',
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

<style scoped>
.panel-padding.v-expansion-panel-content .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
