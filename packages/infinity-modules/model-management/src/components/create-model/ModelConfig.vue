<template>
  <div>
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
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        text
        class="text-none"
        @click="cancel"
        :disabled="deploying"
      >
        Exit
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-none"
        @click="onFinish"
      >
        Finish
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import EditModelConfig from '../EditModelConfig.vue';

export default {
  name: 'ModelConfig',
  components: {
    EditModelConfig,
  },
  data() {
    return {
      model: null,
      loading: false,
      deploying: false,
    };
  },
  computed: {
    ...mapState('modelManagement', ['createdModelId']),
  },
  watch: {
    createdModelId: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.loading = true;
          this.model = null;
          this.model = await this.getModelById(this.createdModelId);
          await this.fetchModelDetails(this.model.modelid);
          this.loading = false;
        }
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setCreatedModelId', 'setModelDetails']),
    ...mapActions('modelManagement', [
      'createNewDeploymentOrder',
      'fetchModelDetails',
      'getModelById',
      'getInputParametersForModelId',
      'getTriggerForModelId',
    ]),
    async onFinish() {
      // validation for model trigger, input parameters (mainid and timestamp)
      const checkInputParam = await this.getInputParametersForModelId(this.model.modelid);
      const checkTrigger = await this.getTriggerForModelId(this.model.modelid);
      if (checkInputParam && checkTrigger) {
        this.cancel();
      } else if (!checkInputParam) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INPUT_PARAM_REQUIRED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'TRIGGER_REQUIRED',
        });
      }
    },
    async cancel() {
      this.setCreatedModelId(null);
      this.setModelDetails(null);
      this.$emit('on-cancel');
    },
    async deployModel() {
      this.deploying = true;
      const created = await this.createNewDeploymentOrder(this.model.modelid);
      if (created) {
        this.cancel();
      }
      this.deploying = false;
    },
  },
};
</script>
