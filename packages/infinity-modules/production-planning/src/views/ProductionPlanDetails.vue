<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>{{ id }}</span>
      <details-toolbar
        v-if="selectedPlan && selectedPlan.length"
        :plan="selectedPlan[0]"
      />
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
            {{ $t('planning.loadingTitle') }}
          </div>
          <div class="title">
            {{ $t('planning.fetchingPlan') }}
          </div>
        </v-col>
      </v-row>
    </v-container>
    <plan-not-found v-else-if="!loading && error" />
    <plan-details v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PlanNotFound from '../components/PlanNotFound.vue';
import PlanDetails from '../components/PlanDetails.vue';
import DetailsToolbar from '../components/details/DetailsToolbar.vue';

export default {
  name: 'ProductionPlanDetails',
  components: {
    PlanNotFound,
    PlanDetails,
    DetailsToolbar,
  },
  data() {
    return {
      error: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['selectedPlan']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.loading = true;
    this.error = false;
    const plan = await this.fetchPlan(this.id);
    this.error = !plan;
    this.loading = false;
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchPlan']),
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
