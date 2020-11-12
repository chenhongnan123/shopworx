<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <a
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-decoration-underline"
      >
        View details
      </a>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Model details for {{ model.modelname }}
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="px-0">
        <v-row
          no-gutters
          align="center"
          justify="center"
          v-if="loading"
        >
          <v-col cols="12" align="center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="36"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" align="center">
            <span>
              Fetching model details...
            </span>
          </v-col>
        </v-row>
        <v-expansion-panels
          flat
          v-else
          accordion
          v-model="expanded"
        >
          <v-expansion-panel v-for="(detail, index) in details" :key="index">
            <v-expansion-panel-header>
              <span>
                <v-icon left>{{ detail.icon }}</v-icon>
                {{ detail.header }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <component
                :model="model"
                :is="detail.component"
                :modelDetails="modelDetails"
              >
              </component>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ModelInputs from './model-details/ModelInputs.vue';
import ModelFiles from './model-details/ModelFiles.vue';
import ModelOutputs from './model-details/ModelOutputs.vue';

export default {
  name: 'ModelDetailsDialog',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  components: {
    ModelInputs,
    ModelFiles,
    ModelOutputs,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      expanded: 0,
      details: [{
        header: 'Input parameters',
        icon: 'mdi-database-arrow-left-outline',
        component: 'model-inputs',
      }, {
        header: 'Files',
        icon: 'mdi-database-cog-outline',
        component: 'model-files',
      }, {
        header: 'Output transformations',
        icon: 'mdi-database-arrow-right-outline',
        component: 'model-outputs',
      }],
    };
  },
  computed: {
    ...mapState('modelManagement', ['modelDetails']),
  },
  methods: {
    ...mapActions('modelManagement', ['fetchModelDetails']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        // eslint-disable-next-line
        await this.fetchModelDetails(this.model._id);
        this.loading = false;
      }
    },
  },
};
</script>
