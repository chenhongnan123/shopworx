<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="600px"
    transition="dialog-transition"
  >
    <template #activator="{ attrs }">
      <v-btn
        small
        v-bind="attrs"
        color="primary"
        class="text-none ml-5"
        :disabled="fetchingMaster"
        @click="OpenDialog"
      >
        <v-icon left small>mdi-plus</v-icon>
        Start new Training
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>New Traning</span>
      </v-card-title>
      <v-window v-model="step">
        <v-window-item
          v-for="item in items"
          :key="item.id"
          :value="item.id"
        >
          <training-data
            @on-cancel="onCancel"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TrainingData from './training-details/TrainingData.vue';

export default {
  name: 'CreateModelDialog',
  components: {
    TrainingData,
  },
  data() {
    return {
      dialog: false,
      step: 1,
      items: [
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
    ...mapActions('modelManagement', ['getInProgressTrainingData']),
    ...mapMutations('helper', ['setAlert']),
    onCancel() {
      this.dialog = false;
      this.step = 1;
    },
    async OpenDialog() {
      const data = await this.getInProgressTrainingData();
      if (data.length > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'TRAINING_IN_PROGRESS',
        });
      } else {
        this.dialog = true;
      }
    },
  },
};
</script>
