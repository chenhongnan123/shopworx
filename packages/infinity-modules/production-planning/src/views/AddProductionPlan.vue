<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span>{{ $t('planning.addPlan') }}</span>
      <v-btn
        small
        outlined
        color="primary"
        @click="goToImport"
        v-if="!isMobile"
        class="text-none ml-2"
      >
        {{ $t('planning.importPlan') }}
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
            {{ $t('planning.loadingTitle') }}
          </div>
          <div class="title">
            {{ $t('planning.fetchingPlan') }}
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
    ...mapState('productionPlanning', ['machines', 'parts', 'partMatrixElement']),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  async created() {
    const machinesNotAvailable = this.machines.length === 0;
    const partsNotAvailable = this.parts.length === 0;
    if (machinesNotAvailable || partsNotAvailable) {
      this.loading = true;
      if (!this.partMatrixElement) {
        await this.getPartMatrixElement();
      }
      await Promise.all([
        this.fetchMachines(),
        this.fetchParts(),
      ]);
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('productionPlanning', [
      'getPartMatrixElement',
      'fetchMachines',
      'fetchParts',
    ]),
    goBack() {
      this.$router.push({ name: 'productionPlanning' });
    },
    goToImport() {
      this.$router.push({
        name: 'productionPlanSettings',
        params: { id: 'import' },
      });
    },
  },
};
</script>
