<template>
  <div style="height: 100%">
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
            Setting up deployment environment
          </div>
        </v-col>
      </v-row>
    </v-container>
    <template v-else>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeploymentIndex',
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    await this.initElements();
    this.loading = false;
  },
  methods: {
    ...mapActions('customerDeployment', ['initElements']),
  },
};
</script>
