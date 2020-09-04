<template>
  <div>
    <template v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        {{ $t('planning.setup.importMaster.fetchMaster') }}
      </span>
    </template>
    <template v-else-if="error">
      {{ $t('planning.setup.importMaster.fetchError') }}
      <a
        @click="fetchMaster"
        class="primary--text font-weight-medium"
      >
      {{ $t('planning.setup.importMaster.retryFetch') }}
      </a>
    </template>
    <template v-else>
      <v-list class="pa-0 transparent">
        <v-list-item
          :key="index"
          class="pa-0"
          v-for="(list, index) in masterList"
        >
          <v-list-item-icon>
            <v-progress-circular
              indeterminate
              v-if="list.loading"
            ></v-progress-circular>
            <template v-else>
              <v-icon
                color="success"
                v-if="list.success"
                v-text="'$success'"
              ></v-icon>
              <v-icon
                v-else
                color="error"
                v-text="'$error'"
              ></v-icon>
            </template>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              {{ list.title }}
            </v-list-item-title>
            <validate-part-matrix
              :data="list"
              :files="files"
              @on-loading="onLoading($event, index)"
              @on-validation="onValidation($event, index)"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn
        block
        rounded
        color="primary"
        id="finishImport"
        class="text-none"
        :disabled="!valid"
        @click="$emit('success')"
      >
        <v-icon
          left
          v-text="'$forward'"
        ></v-icon>
        Continue to next step
      </v-btn>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ValidatePartMatrix from './ValidatePartMatrix.vue';

export default {
  name: 'ProcessPartMatrix',
  props: {
    files: {
      type: FileList,
      required: true,
    },
  },
  components: {
    ValidatePartMatrix,
  },
  data() {
    return {
      valid: false,
      error: false,
      masterList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState('planning', ['partMatrixMaster']),
  },
  created() {
    this.fetchMaster();
  },
  methods: {
    ...mapActions('planning', ['getPartMatrixMaster']),
    async fetchMaster() {
      this.loading = true;
      const success = await this.getPartMatrixMaster({
        generateData: false,
      });
      if (success) {
        this.masterList = this.partMatrixMaster;
      }
      this.error = !success;
      this.loading = false;
    },
    onValidation(success, index) {
      this.masterList[index].success = success;
      if (this.masterList.every((v) => v.success)) {
        this.valid = true;
      }
    },
    onLoading(loading, index) {
      this.masterList[index].loading = loading;
    },
  },
};
</script>
