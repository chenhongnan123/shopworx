<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="650px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none ml-5"
        :disabled="fetchingMaster"
      >
        <v-icon left small>mdi-plus</v-icon>
        Create new model
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <span>
          Step {{ step }} of {{ items.length }}
          <v-progress-linear :value="progress"></v-progress-linear>
        </span>
      </v-card-title>
      <v-window v-model="step">
        <v-window-item
          v-for="item in items"
          :key="item.id"
          :value="item.id"
        >
          <model-info
            @on-cancel="dialog = false"
            @on-save="step += 1"
            v-if="item.id === 1"
          />
          <model-config
            v-else
            @on-cancel="onCancel"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import ModelInfo from './create-model/ModelInfo.vue';
import ModelConfig from './create-model/ModelConfig.vue';

export default {
  name: 'CreateModelDialog',
  components: {
    ModelInfo,
    ModelConfig,
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
          title: 'Configure model',
        },
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', ['fetchingMaster']),
    currentTitle() {
      return this.items[this.step - 1].title;
    },
    progress() {
      return (this.step / this.items.length) * 100;
    },
  },
  methods: {
    onCancel() {
      this.dialog = false;
      this.step = 1;
    },
  },
};
</script>
