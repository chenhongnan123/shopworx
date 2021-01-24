<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }" v-if="!isDashboardView">
      <v-icon small color="primary">mdi-memory</v-icon>
      <a
        v-on="on"
        v-bind="attrs"
        color="primary"
      >
        Configure model
      </a>
    </template>
    <template #activator="{ on, attrs }" v-else>
      <v-btn
        class="text-none mr-2"
        color="white"
        small
        outlined
        v-on="on"
        v-bind="attrs"
      >
        <v-icon left small color="white">mdi-memory</v-icon>
        Configure model
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Model details for {{ model.name }}
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-0" v-if="loading">
        <v-row
          no-gutters
          align="center"
          justify="center"
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
              Fetching model configurations...
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <edit-model-config :model="model" v-else />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import EditModelConfig from './EditModelConfig.vue';

export default {
  name: 'ModelDetailsDialog',
  props: {
    model: {
      type: Object,
      required: true,
    },
    isDashboardView: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EditModelConfig,
  },
  data() {
    return {
      dialog: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions('modelManagement', ['fetchModelDetails']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        await this.fetchModelDetails(this.model.model_id);
        this.loading = false;
      }
    },
  },
};
</script>
