<template>
  <div style="height:100%">
    <portal to="app-header">
      <v-btn class="mb-1" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ id }}
      <template v-if="selectedModel">
        <deploy-model
          :model="selectedModel"
          small
          spaceClass="ml-4"
        />
        <delete-model
          :model="selectedModel"
          small
          spaceClass="ml-2"
        />
      </template>
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
            If you had facts, you wouldn’t need statistics.
          </div>
          <div class="title">
            Fetching model data...
          </div>
        </v-col>
      </v-row>
    </v-container>
    <model-not-found v-else-if="!loading && error" />
    <model-dashboard v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ModelNotFound from '../components/ModelNotFound.vue';
import ModelDashboard from '../components/ModelDashboard.vue';
import DeployModel from '../components/DeployModel.vue';
import DeleteModel from '../components/DeleteModel.vue';

export default {
  name: 'ModelDetails',
  components: {
    ModelNotFound,
    ModelDashboard,
    DeployModel,
    DeleteModel,
  },
  data() {
    return {
      error: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('modelManagement', ['selectedModel']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.loading = true;
    this.error = false;
    const model = await this.fetchModelByName(this.id);
    this.error = !model;
    this.loading = false;
  },
  methods: {
    ...mapActions('modelManagement', ['fetchModelByName']),
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
