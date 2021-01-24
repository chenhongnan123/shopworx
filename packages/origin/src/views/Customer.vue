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
    <v-container fill-height v-else-if="!loading && !isContextSet">
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="5" align="center">
          <v-img
            :src="
              require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)
            "
            contain
          />
        </v-col>
        <v-col cols="12" align="center">
          <div class="headline">
            To the customer, you are the company.
          </div>
        </v-col>
        <v-col cols="12" align="center">
          <origin-set-context />
        </v-col>
      </v-row>
    </v-container>
    <router-view v-else />
  </v-fade-transition>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import OriginSetContext from '@/components/util/OriginSetContext.vue';

export default {
  name: 'Customer',
  components: {
    OriginSetContext,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapState('customer', [
      'customers',
    ]),
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
    isContextSet() {
      return this.me;
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
