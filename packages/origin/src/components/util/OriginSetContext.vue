<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-on="on"
        v-bind="attrs"
        color="secondary"
        rounded
        class="text-none"
      >
        <v-icon left small>mdi-face</v-icon>
        {{ buttonName }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Set customer
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-combobox
          :items="customers"
          v-model="customer"
          label="Customer"
          filled
          :loading="loading"
          :disabled="saving"
          item-text="description"
        ></v-combobox>
        <v-combobox
          :items="customerSites"
          v-model="customerSite"
          label="Site"
          filled
          :loading="fetchingSites"
          :disabled="loading || saving"
          item-text="siteDescription"
        ></v-combobox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none"
          color="primary"
          @click="save"
          :disabled="loading || fetchingSites"
          :loading="saving"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

export default {
  name: 'OriginSetContext',
  data() {
    return {
      loading: false,
      fetchingSites: false,
      saving: false,
    };
  },
  computed: {
    ...mapState('user', ['me', 'activeSite']),
    ...mapState('customer', [
      'customers',
      'customerSites',
      'contextDialog',
      'selectedCustomer',
      'selectedCustomerSite',
    ]),
    ...mapGetters('user', ['currentSite', 'currentCustomer']),
    dialog: {
      get() {
        return this.contextDialog;
      },
      set(val) {
        this.setContextDialog(val);
      },
    },
    customer: {
      get() {
        return this.selectedCustomer;
      },
      async set(val) {
        this.fetchingSites = true;
        await this.setActiveCustomer(val);
        await this.getCustomerSites(val.id);
        this.fetchingSites = false;
      },
    },
    customerSite: {
      get() {
        return this.selectedCustomerSite;
      },
      async set(val) {
        await this.setActiveSite(val);
      },
    },
    isContextSet() {
      return this.me;
    },
    buttonName() {
      if (this.isContextSet) {
        return `${this.currentCustomer}, ${this.currentSite}`;
      }
      return 'Set customer';
    },
  },
  methods: {
    ...mapMutations('customer', [
      'setContextDialog',
      'setSelectedCustomer',
      'setSelectedCustomerSite',
    ]),
    ...mapActions('user', ['getMe']),
    ...mapActions('customer', [
      'getContextDetails',
      'getCustomerSites',
      'setActiveCustomer',
      'setActiveSite',
    ]),
    async save() {
      this.saving = true;
      await this.setActiveCustomer(this.customer);
      await this.setActiveSite(this.customerSite);
      await this.getMe();
      this.dialog = false;
      this.saving = false;
      const { path } = this.$route;
      const splitPath = path.split('/');
      this.$router.replace(`/customer/${splitPath[2]}`);
      window.location.reload();
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        if (this.customers.length === 0) {
          await this.getContextDetails();
        }
        if (this.isContextSet) {
          const selectedCustomer = this.customers.find((c) => c.id === this.me.customer.id);
          this.fetchingSites = true;
          await this.getCustomerSites(selectedCustomer.id);
          this.fetchingSites = false;
          const selectedSite = this.customerSites.find((s) => s.id === this.activeSite);
          this.setSelectedCustomer(selectedCustomer);
          this.setSelectedCustomerSite(selectedSite);
        }
        this.loading = false;
      }
    },
  },
};
</script>
