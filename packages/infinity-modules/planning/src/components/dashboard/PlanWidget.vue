<template>
  <div>
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <span
        class="title font-weight-regular"
        v-text="title"
      ></span>
      <span
        v-if="plans.length"
        class="title font-weight-regular"
      >
        ({{ plans.length }})
      </span>
      <v-spacer></v-spacer>
      <template v-if="!selectedPlans.length">
        <v-btn icon @click="$emit('refresh-widget')">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <add-plan
          #default="{ on }"
          @on-add="$emit('refresh-widget')"
        >
          <v-btn
            icon
            v-on="on"
            v-if="addPlan"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </add-plan>
      </template>
      <template v-else>
        <toggle-star
          :starred="starredPlans"
          :plans="selectedPlans"
          @on-update="$emit('refresh-widget')"
        />
        <!-- <abort-plan
          :plans="selectedPlans"
          @on-abort="$emit('refresh-widget')"
        /> -->
        <delete-plan
          :plans="selectedPlans"
          @on-delete="$emit('refresh-widget')"
        />
        <add-plan
          #default="{ on }"
          edit
          :planToEdit="selectedPlans[0]"
          v-if="selectedPlans.length === 1"
          @on-add="$emit('refresh-widget')"
        >
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>
              mdi-pencil-outline
            </v-icon>
          </v-btn>
        </add-plan>
        <add-plan
          #default="{ on }"
          duplicate
          :planToEdit="selectedPlans[0]"
          v-if="selectedPlans.length === 1"
          @on-add="$emit('refresh-widget')"
        >
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>
              mdi-content-copy
            </v-icon>
          </v-btn>
        </add-plan>
      </template>
    </v-toolbar>
    <perfect-scrollbar style="max-height: 400px;">
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
            No plans...
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
                      <v-col cols="12" md="5">
                        <v-list-item-title>
                          <span v-text="plan.planid"></span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <div v-text="plan.machinename"></div>
                          <div v-text="plan.partname"></div>
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="12" md="7" class="my-auto">
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
                  <v-list-item-action>
                    <v-checkbox
                      hide-details
                      v-model="plan.selected"
                      @change="onSelectionChanged(plan)"
                    ></v-checkbox>
                  </v-list-item-action>
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
    </perfect-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';
import ToggleStar from '../ToggleStar.vue';
import DeletePlan from '../DeletePlan.vue';
// import AbortPlan from '../AbortPlan.vue';
import AddPlan from '../AddPlan.vue';

export default {
  name: 'PlanWidget',
  components: {
    ToggleStar,
    DeletePlan,
    // AbortPlan,
    AddPlan,
  },
  props: {
    groupedPlans: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    addPlan: {
      type: Boolean,
      default: false,
    },
    starredPlans: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedPlans: [],
    };
  },
  watch: {
    groupedPlans() {
      this.selectedPlans = [];
    },
  },
  computed: {
    ...mapGetters('planning', ['planStatusClass']),
    plans() {
      if (this.groupedPlans) {
        const items = Object
          .keys(this.groupedPlans)
          .map((planId) => {
            const plans = this.groupedPlans[planId];
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
    getScheduledStart(plan) {
      return `Scheduled start ${distanceInWordsToNow(
        new Date(plan.scheduledstart),
        { addSuffix: true },
      )}`;
    },
    onSelectionChanged(plan) {
      if (plan.selected) {
        this.selectedPlans.push(plan);
      } else {
        const index = this.selectedPlans.findIndex((p) => p._id === plan._id);
        this.selectedPlans.splice(index, 1);
      }
    },
  },
};
</script>
