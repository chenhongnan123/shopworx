<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none ml-5"
      >
        <v-icon left small>mdi-plus</v-icon>
        Create new model
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="secondary"
          class="white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>
      <v-window v-model="step">
        <v-window-item
          v-for="item in items"
          :key="item.id"
          :value="item.id"
        >
          <model-info v-if="item.id === 1" />
          <model-inputs v-if="item.id === 2" />
          <model-files v-if="item.id === 3" />
          <model-outputs v-if="item.id === 4" />
          <model-review v-if="item.id === 5" />
        </v-window-item>
      </v-window>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
          @click="step--"
          :disabled="step === 1"
        >
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          @click="step++"
          color="primary"
          :disabled="step === 5"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ModelInfo from './create-model/ModelInfo.vue';
import ModelInputs from './create-model/ModelInputs.vue';
import ModelFiles from './create-model/ModelFiles.vue';
import ModelOutputs from './create-model/ModelOutputs.vue';
import ModelReview from './create-model/ModelReivew.vue';

export default {
  name: 'CreateModelDialog',
  components: {
    ModelInfo,
    ModelInputs,
    ModelFiles,
    ModelOutputs,
    ModelReview,
  },
  data() {
    return {
      dialog: false,
      step: 1,
      items: [
        {
          id: 1,
          title: 'Create new model',
        },
        {
          id: 2,
          title: 'Associate model inputs',
        },
        {
          id: 3,
          title: 'Upload model files',
        },
        {
          id: 4,
          title: 'Associate model outputs',
        },
        {
          id: 5,
          title: 'Review model details',
        },
      ],
    };
  },
  computed: {
    currentTitle() {
      return this.items[this.step - 1].title;
    },
  },
};
</script>
