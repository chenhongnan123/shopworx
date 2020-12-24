<template>
  <v-container fluid class="py-0" fill-height>
    <v-row justify="center" v-if="deploymentServices.length">
      <v-col cols="12" xl="10" class="py-0">
        <v-row>
          <v-col cols="12" md="6">
            <!-- service selection -->
            <!-- service addition -->
          </v-col>
          <v-col cols="12" md="6">
            <!-- <sse-state /> -->
          </v-col>
        </v-row>
        <!-- devices -->
        <v-fade-transition mode="out-in">
          <!-- selected device info -->
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-row
      v-else
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
        <span class="headline">
          No deployment service found.
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn color="primary" class="text-none" @click="addNew">
          <v-icon left>mdi-plus</v-icon>
          Add new service
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DeploymentService',
  data() {
    return {
      deploymentServices: [],
    };
  },
  computed: {
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
  },
  methods: {
    addNew() {
      this.$router.push({ name: 'addProductionPlan' });
    },
  },
};
</script>
