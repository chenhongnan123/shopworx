<template>
  <v-fade-transition mode="out-in">
    <v-container fill-height v-if="loading">
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="72"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12" align="center">
          <div class="headline">
            To the customer, you are the company.
          </div>
          <div class="title">
            Fetching customers
          </div>
        </v-col>
      </v-row>
    </v-container>
    <router-view v-else />
  </v-fade-transition>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Customer',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapState('customer', [
      'customers',
      'selectedCustomer',
      'selectedCustomerSite',
    ]),
    isContextSet() {
      return this.selectedCustomer
        && this.selectedCustomerSite
        && this.me;
    },
    areCustomersAvailable() {
      return this.customers && this.customers.length > 0;
    },
  },
  async created() {
    this.loading = true;
    const context = await this.getMe();
    if (context) {
      this.setContextDialog(false);
    } else {
      await this.getContextDetails();
      if (this.areCustomersAvailable && !this.isContextSet) {
        this.setContextDialog(true);
      }
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('customer', ['setContextDialog']),
    ...mapActions('user', ['getMe']),
    ...mapActions('customer', ['getContextDetails']),
  },
};
</script>
