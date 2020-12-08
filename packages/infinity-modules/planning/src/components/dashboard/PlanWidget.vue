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
            small
            v-on="on"
            v-if="addPlan"
            color="primary"
            class="text-none"
          >
            <v-icon small left>mdi-plus</v-icon>
            Add plan
          </v-btn>
        </add-plan>
      </template>
      <template v-else>
        <toggle-star
          :starred="starredPlans"
          :plans="selectedPlans.flat()"
          @on-update="$emit('refresh-widget')"
        />
        <abort-plan
          v-if="!addPlan"
          :plans="selectedPlans.flat()"
          @on-abort="$emit('refresh-widget')"
        />
        <delete-plan
          v-if="addPlan"
          :plans="selectedPlans.flat()"
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
              <template v-for="(plan, planId, index) in groupedPlans">
                <plan-list-item
                  :key="index"
                  :plan="plan"
                  :planId="planId"
                  :selectedPlans.sync="selectedPlans"
                />
                <v-divider
                  :key="`d-${index}`"
                  v-if="index < plans.length - 1"
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
import PlanListItem from './PlanListItem.vue';

export default {
  name: 'PlanWidget',
  components: {
    ToggleStar,
    DeletePlan,
    AbortPlan,
    AddPlan,
    PlanListItem,
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
            return {
              ...plans[0],
              planid: planId,
            };
          });
        return items;
      }
      return [];
    },
  },
};
</script>
