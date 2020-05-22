<template>
  <order-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :starredPlans="true"
    :title="'Released Orders'"
    @refresh-widget="fetchPlans"
  ></order-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import OrderWidget from '../OrderWidget.vue';

export default {
  name: 'StarredPlans',
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
    ...mapMutations('orderManagement', ['setPausedPlanCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getOrderRecords('?query=orderstatus=="Released"%26%26starred==false');
      if (!this.plans) {
        this.error = true;
      } else {
        this.setPausedPlanCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
