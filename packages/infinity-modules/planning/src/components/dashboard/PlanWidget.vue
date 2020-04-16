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
      <template v-if="!selected.length">
        <v-btn icon>
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
        <v-btn icon v-if="addPlan" @click="setAddPlanDialog(true)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn icon v-if="!starredPlans">
          <v-icon>mdi-star-outline</v-icon>
        </v-btn>
        <v-btn icon v-else>
          <v-icon>mdi-star-off</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-close-octagon-outline</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <template v-if="loading">
    </template>
    <template v-else-if="error">
    </template>
    <template >
    </template>
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
                      :color="planStatusClass(plan.planstatus)"
                    >
                    </v-avatar>
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
import { mapMutations } from 'vuex';

export default {
  name: 'PlanWidget',
  props: {
    plans: {
      type: Array,
      default: () => [],
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
  computed: {
    selected() {
      return this.plans
        .filter((plan) => plan.selected)
        .map((plan) => plan._id);
    },
  },
  methods: {
    ...mapMutations('planning', ['setAddPlanDialog']),
    planStatusClass(planstatus) {
      switch (planstatus) {
        case 'In Progress': return 'success';
        case 'Paused': return 'warning';
        case 'Not Started': return 'info';
        case 'Abort': return 'error';
        case 'Complete': return 'accent';
        default: return '';
      }
    },
  },
};
</script>
