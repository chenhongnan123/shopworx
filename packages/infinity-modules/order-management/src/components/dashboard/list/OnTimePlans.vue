<template>
  <order-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="'Orders running on time'"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import OrderWidget from '../OrderWidget.vue';

export default {
  name: 'OnTimePlans',
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
    ...mapMutations('orderManagement', ['setOnTimePlanCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords(
        '?query=orderstatus=="Running"%26%26starred==false',
      );
      if (!this.plans) {
        this.error = true;
      } else {
        this.setOnTimePlanCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
