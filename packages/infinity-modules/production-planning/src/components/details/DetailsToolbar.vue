<template>
  <span class="ml-4">
    <star-plan
      :listType="listType"
      :starred="starred"
      :planId="planId"
      small
    />
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-on="on"
          v-bind="attrs"
          small
          class="ml-2"
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
          small
          class="mx-2"
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
      :listType="listType"
      :planId="planId"
      small
    />
    <delete-plan
      v-else-if="notStarted"
      :listType="listType"
      :planId="planId"
      small
    />
  </span>
</template>

<script>
import StarPlan from '../actions/StarPlan.vue';
import AbortPlan from '../actions/AbortPlan.vue';
import DeletePlan from '../actions/DeletePlan.vue';

export default {
  name: 'DetailsToolbar',
  props: {
    listType: {
      type: String,
      default: '',
    },
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
