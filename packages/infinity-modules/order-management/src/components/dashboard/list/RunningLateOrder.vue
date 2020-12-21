<template>
  <order-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="$t('Orders Running late')"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions } from 'vuex';
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
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords(`?query=orderexpendtime<${Date.now()}%26%26orderstatus=="Running"`);
      if (!this.plans) {
        this.error = true;
      }
      this.loading = false;
    },
  },
};
</script>
