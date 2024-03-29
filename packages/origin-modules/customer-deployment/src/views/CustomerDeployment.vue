<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Deployment Manager</span>
      <app-info #default="{ on: dialog, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              icon
              small
              v-on="{ ...tooltip, ...dialog }"
              v-bind="attrs"
              class="ml-4 mb-1"
            >
              <v-icon
                v-text="'$info'"
              ></v-icon>
            </v-btn>
          </template>
          Info
        </v-tooltip>
      </app-info>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="gotToSettings"
          >
            <v-icon
              v-text="'$settings'"
            ></v-icon>
          </v-btn>
        </template>
        Settings
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="goToUpdates"
          >
            <v-icon
              v-text="'mdi-update'"
            ></v-icon>
          </v-btn>
        </template>
        Deployement updates
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
import AppInfo from '../components/AppInfo.vue';

export default {
  name: 'CustomerDeployment',
  components: {
    DeploymentService,
    AppInfo,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('customerDeployment', ['deploymentServices', 'selectedService']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapMutations('customerDeployment', ['setSelectedService']),
    ...mapActions('customerDeployment', ['fetchDeploymentServices']),
    gotToSettings() {
      this.$router.push({ name: 'deploymentSettings' });
    },
    goToUpdates() {
      this.$router.push({ name: 'deploymentUpdates' });
    },
  },
  async created() {
    this.loading = true;
    await this.fetchDeploymentServices();
    if (this.deploymentServices.length) {
      this.setExtendedHeader(true);
      const service = this.selectedService
        ? this.deploymentServices
          .find((d) => d.id === this.selectedService.id)
        : null;
      if (!service) {
        this.setSelectedService(this.deploymentServices[0]);
      }
    } else {
      this.setExtendedHeader(false);
    }
    this.loading = false;
  },
};
</script>
