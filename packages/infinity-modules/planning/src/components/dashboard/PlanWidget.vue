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
        <abort-plan
          :plans="selectedPlans"
          @on-abort="$emit('refresh-widget')"
        />
        <delete-plan
          :plans="selectedPlans"
          @on-delete="$emit('refresh-widget')"
        />
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
            <v-list>
              <template v-for="(plan, i) in plans">
                <v-list-item :key="i">
                  <v-list-item-avatar>
                    <v-avatar
                      size="24"
                      :color="planStatusClass(plan.status)"
                    ></v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span v-text="plan.planid"></span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div v-text="plan.machinename"></div>
                      <div v-text="plan.partname"></div>
                    </v-list-item-subtitle>
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
import ToggleStar from '../ToggleStar.vue';
import DeletePlan from '../DeletePlan.vue';
import AbortPlan from '../AbortPlan.vue';
import AddPlan from '../AddPlan.vue';

export default {
  name: 'PlanWidget',
  components: {
    ToggleStar,
    DeletePlan,
    AbortPlan,
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
    onSelectionChanged(plan) {
      if (plan.selected) {
        this.selectedPlans.push(plan);
      } else {
        const index = this.selectedPlans.findIndex((p) => p._id === plan._id);
        this.selectedPlans.splice(index, 1);
      }
    },
    planStatusClass(planstatus) {
      switch (planstatus) {
        case 'inProgress': return 'success';
        case 'paused': return 'warning';
        case 'notStarted': return 'info';
        case 'aborted': return 'error';
        case 'complete': return 'accent';
        default: return '';
      }
    },
  },
};
</script>
