<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Deployment</span>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-4 mb-1"
            @click="gotToSettings"
          >
            <v-icon
              v-text="'$settings'"
            ></v-icon>
          </v-btn>
        </template>
        Settings
      </v-tooltip>
    </portal>
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
            Fetching services...
          </div>
        </v-col>
      </v-row>
    </v-container>
    <deployment-service v-else />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import DeploymentService from '../components/DeploymentService.vue';

export default {
  name: 'CustomerDeployment',
  components: {
    DeploymentService,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('customerDeployment', ['deploymentServices']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapMutations('customerDeployment', ['setSelectedService']),
    ...mapActions('customerDeployment', ['fetchDeploymentServices']),
    gotToSettings() {
      this.$router.push({ name: 'deploymentSettings' });
    },
  },
  async created() {
    this.loading = true;
    await this.fetchDeploymentServices();
    if (this.deploymentServices.length) {
      this.setExtendedHeader(true);
      this.setSelectedService(this.deploymentServices[0]);
    } else {
      this.setExtendedHeader(false);
    }
    this.loading = false;
  },
};
</script>
