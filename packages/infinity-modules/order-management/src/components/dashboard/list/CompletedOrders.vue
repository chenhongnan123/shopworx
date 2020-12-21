<template>
  <order-widget
    :plans="plans"
    :error="error"
    :addPlan="false"
    :loading="loading"
    :title="$t('Completed Orders')"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import OrderWidget from '../OrderWidget.vue';

export default {
  name: 'CompletedOrders',
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
    ...mapMutations('orderManagement', ['setCompletedOrdersCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords('?query=orderstatus=="Completed"');
      if (!this.plans) {
        this.error = true;
      } else {
        this.setCompletedOrdersCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
