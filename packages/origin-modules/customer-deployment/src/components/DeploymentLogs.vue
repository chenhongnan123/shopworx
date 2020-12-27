<template>
  <v-card>
    <v-card-title class="pb-0">
      Logs
    </v-card-title>
    <v-divider></v-divider>
    <perfect-scrollbar>
      <v-card-text class="pb-0" style="height:408px">
        <v-container fill-height>
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col cols="12" align="center">
              <v-img
                :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
                id="construction_illustration"
                height="260"
                contain
              />
            </v-col>
            <v-col cols="12" align="center">
              <div class="title">
                Coming soon!
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </perfect-scrollbar>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DeploymentLogs',
  computed: {
    ...mapState('customerDeployment', ['selectedDevice']),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'coming-soon-dark'
        : 'coming-soon-light';
    },
  },
};
</script>
