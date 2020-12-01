<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>Add new plans</span>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none ml-2"
      >
        ...or import instead
      </v-btn>
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
            Plan your work and work your plan.
          </div>
          <div class="title">
            Fetching seed data...
          </div>
        </v-col>
      </v-row>
    </v-container>
    <add-plan v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AddPlan from '../components/actions/AddPlan.vue';

export default {
  name: 'AddProductionPlan',
  components: {
    AddPlan,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['machines', 'parts']),
  },
  async created() {
    const machinesNotAvailable = this.machines.length === 0;
    const partsNotAvailable = this.parts.length === 0;
    if (machinesNotAvailable || partsNotAvailable) {
      this.loading = true;
      await Promise.all([
        this.fetchMachines(),
        this.fetchParts(),
      ]);
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchMachines', 'fetchParts']),
    goBack() {
      this.$router.push({ name: 'productionPlanning' });
    },
  },
};
</script>
