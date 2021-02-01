<template>
  <order-widget
    :plans="plans"
    :error="error"
    :addPlan="false"
    :loading="loading"
    :title="$t('New Orders')"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import OrderWidget from '../OrderWidget.vue';

export default {
  name: 'NotStartedPlans',
  components: {
    OrderWidget,
  },
  data() {
    return {
      plans: [],
      error: false,
      loading: false,
    };
  },
  created() {
    this.fetchPlans();
  },
  methods: {
    ...mapActions('orderManagement', ['getOrderRecords']),
    ...mapMutations('orderManagement', ['setNotStartedPlanCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords('?query=orderstatus=="New"%26%26starred==false');
      if (!this.plans) {
        this.error = true;
      } else {
        this.setNotStartedPlanCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
