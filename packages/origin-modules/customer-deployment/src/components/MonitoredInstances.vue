<template>
  <v-card>
    <v-card-title class="pb-0">
      Monitored instances
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
                id="server_illustration"
                height="260"
                contain
              />
            </v-col>
            <v-col cols="12" align="center" class="pt-0">
              <div class="title">
                Your monitored instances appear here
              </div>
              <div>
                <add-instance
                  @on-create="getInstances"
                  #default="{ on, attrs }"
                >
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    class="text-none mt-1"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Create instance
                  </v-btn>
                </add-instance>
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
import AddInstance from './actions/AddInstance.vue';

export default {
  name: 'MonitoredInstances',
  components: {
    AddInstance,
  },
  computed: {
    ...mapState('customerDeployment', ['selectedDevice']),
    illustration() {
      return this.$vuetify.theme.dark
        ? 'server-dark'
        : 'server-light';
    },
  },
  methods: {
    getInstances() {},
  },
};
</script>
