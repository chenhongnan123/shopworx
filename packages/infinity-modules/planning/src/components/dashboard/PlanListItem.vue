<template>
  <v-list-item
    :style="`border-left: 6px solid var(--v-${planStatusClass(plan[0].status)}-base)`"
  >
    <v-list-item-action class="mb-auto">
      <v-checkbox
        hide-details
        v-model="plan.selected"
        @change="$emit('selection-changed', plan)"
      ></v-checkbox>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        <a
          @click="$router.push({
            name: 'plan-detail',
            params: { id: planId }
          })"
          v-text="planId"
          class="font-weight-medium"
        ></a>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div v-text="plan[0].machinename"></div>
        <div>
          {{ getStartTime(plan[0]) }}
        </div>
      </v-list-item-subtitle>
      <template v-for="(p, n) in plan">
        <v-progress-linear
          :key="n"
          :height="25"
          class="mt-1"
          color="secondary"
          :value="(getPartQty(p.partname) / p.plannedquantity) * 100"
        >
          <span class="font-weight-medium mr-auto ml-2">
            {{ p.partname }}
          </span>
          <span class="font-weight-medium ml-auto mr-2">
            {{getPartQty(p.partname)}}/{{p.plannedquantity}}
          </span>
        </v-progress-linear>
      </template>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanListItem',
  props: {
    plan: {
      type: Array,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('planning', ['planStatusClass', 'realTimeValue']),
  },
  methods: {
    getPartQty(partname) {
      const val = this.realTimeValue(this.planId);
      return (val !== {}
        && val[partname]
        && val[partname].qty) || 0;
    },
    getStartTime(plan) {
      if (plan.status === 'notStarted') {
        return `Scheduled start ${distanceInWordsToNow(
          new Date(plan.scheduledstart),
          { addSuffix: true },
        )}`;
      }
      return `Started ${distanceInWordsToNow(
        new Date(plan.actualstart),
        { addSuffix: true },
      )}`;
    },
  },
};
</script>
