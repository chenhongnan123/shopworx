<template>
  <div>
    <star-plan
      :starred="starred"
      :planId="planId"
    />
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-on="on"
          v-bind="attrs"
          v-if="inProgress || notStarted"
          @click="$router.push({
            name: 'editProductionPlan',
            params: { id: planId },
          })"
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      Edit plan
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-on="on"
          v-bind="attrs"
          @click="$router.push({
            name: 'duplicateProductionPlan',
            params: { id: planId },
          })"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </template>
      Duplicate plan
    </v-tooltip>
    <abort-plan
      v-if="inProgress"
      :planId="planId"
    />
    <delete-plan
      v-else-if="notStarted"
      :planId="planId"
    />
  </div>
</template>

<script>
import StarPlan from '../actions/StarPlan.vue';
import AbortPlan from '../actions/AbortPlan.vue';
import DeletePlan from '../actions/DeletePlan.vue';

export default {
  name: 'PlanActionsTemplate',
  props: {
    plan: {
      type: Object,
      required: true,
    },
  },
  components: {
    StarPlan,
    AbortPlan,
    DeletePlan,
  },
  computed: {
    planId() {
      return this.plan.planid;
    },
    inProgress() {
      return this.plan.status === 'inProgress';
    },
    notStarted() {
      return this.plan.status === 'notStarted';
    },
    starred() {
      return this.plan.starred;
    },
  },
};
</script>
