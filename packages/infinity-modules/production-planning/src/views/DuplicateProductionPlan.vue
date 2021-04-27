<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>{{ $t('planning.duplicate', { id }) }}</span>
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
    <duplicate-plan v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PlanNotFound from '../components/PlanNotFound.vue';
import DuplicatePlan from '../components/actions/DuplicatePlan.vue';

export default {
  name: 'DuplicateProductionPlan',
  components: {
    PlanNotFound,
    DuplicatePlan,
  },
  data() {
    return {
      error: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['machines', 'parts', 'partMatrixElement']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    const machinesNotAvailable = this.machines.length === 0;
    const partsNotAvailable = this.parts.length === 0;
    this.loading = true;
    const plan = await this.fetchPlan(this.id);
    if (plan) {
      if (machinesNotAvailable || partsNotAvailable) {
        this.error = false;
        if (!this.partMatrixElement) {
          await this.getPartMatrixElement();
        }
        await Promise.all([
          this.fetchMachines(),
          this.fetchParts(),
        ]);
      }
    } else {
      this.error = true;
    }
    this.loading = false;
  },
  methods: {
    ...mapActions('productionPlanning', [
      'fetchPlan',
      'getPartMatrixElement',
      'fetchMachines',
      'fetchParts',
    ]),
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
