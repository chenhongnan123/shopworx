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
        <v-btn icon @click="$emit('refresh-widget')">
          <v-icon>mdi-refresh</v-icon>
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
            No Orders...
          </v-card-text>
          <v-card-text
            v-else
            class="pa-0"
          >
            <v-list>
              <template v-for="(plan, i) in plans">
                <v-list-item :key="i" @click="orderDetails(plan)">
                  <v-list-item-avatar>
                    <v-avatar
                      size="24"
                      :color="planStatusClass(plan.orderstatus)"
                    >
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-row justify="left">
                      <v-col cols="12" md="4" xl="2">
                        <v-list-item-title>
                          <span>Line1</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <div v-text="plan.productname"></div>
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="12" md="4" xl="2">
                        <v-list-item-title>
                          <span v-text="plan.ordername"></span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <div v-text="plan.producttype"></div>
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="12" md="4" xl="2">
                        <v-list-item-title>
                          Target: <span v-text="plan.targetcount"></span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Actual: <span v-text="plan.actualcount"></span>
                        </v-list-item-subtitle>
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
    </perfect-scrollbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'OrderWidget',
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
    ...mapMutations('orderManagement', ['setAddPlanDialog']),
    planStatusClass(planstatus) {
      switch (planstatus) {
        case 'Running': return 'success';
        case 'Interrupted': return 'error';
        case 'New': return 'info';
        case 'Released': return 'warning';
        case 'Completed': return 'accent';
        default: return '';
      }
    },
    orderDetails(plan) {
      console.log(plan);
      this.$router.push({ name: 'order-details', params: { id: plan } });
    },
  },
};
</script>
