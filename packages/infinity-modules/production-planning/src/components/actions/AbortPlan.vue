<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        :small="small"
        color="error"
        @click="updatePlan"
      >
        <v-icon>mdi-close-octagon-outline</v-icon>
      </v-btn>
    </template>
    {{ $t('planning.abortPlan') }}
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AbortPlan',
  props: {
    planId: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
      default: 'all',
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['updatePlanByPlanId']),
    async updatePlan() {
      if (await this.$root.$confirm.open(
        this.$t('planning.confirmAbortTitle'),
        this.$t('planning.confirmAbortSubtitle', { id: this.planid }),
      )) {
        await this.updatePlanByPlanId({
          planId: this.planId,
          payload: {
            status: 'abort',
            actualend: new Date().getTime(),
          },
          listType: this.listType,
        });
      }
    },
  },
};
</script>
