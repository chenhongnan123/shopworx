<template>
  <order-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="'Interrupted Orders'"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import OrderWidget from '../OrderWidget.vue';

export default {
  name: 'OverduePlans',
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
    ...mapMutations('orderManagement', ['setInterruptedOrderCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords('?query=orderstatus=="Interrupted"');
      if (!this.plans) {
        this.error = true;
      } else {
        this.setInterruptedOrderCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
