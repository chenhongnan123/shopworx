<template>
  <v-card-text class="px-0">
    <v-expansion-panels
      flat
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
</template>

<script>
import { mapState } from 'vuex';
import ModelInputs from './model-details/ModelInputs.vue';
import ModelFiles from './model-details/ModelFiles.vue';
import ModelOutputs from './model-details/ModelOutputs.vue';
import ModelCritical from './model-details/ModelCritical.vue';
import ModelTrigger from './model-details/ModelTrigger.vue';

export default {
  name: 'EditModelConfig',
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
    ModelCritical,
    ModelTrigger,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      expanded: null,
      details: [{
        header: 'Create trigger',
        icon: 'mdi-database-cog-outline',
        component: 'model-trigger',
      }, {
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
      }, {
        header: 'Critical parameters',
        icon: 'mdi-database-arrow-left-outline',
        component: 'model-critical',
      }],
    };
  },
  computed: {
    ...mapState('modelManagement', ['modelDetails']),
  },
};
</script>
