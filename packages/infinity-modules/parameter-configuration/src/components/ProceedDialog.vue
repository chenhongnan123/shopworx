<template>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Confirmation?
           <v-spacer></v-spacer>
           <v-btn icon small @click="cancleCreation">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
          <v-expansion-panels
      flat
      accordion
    >
      <v-expansion-panel v-if="responce">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.EMPTY_COLUMN_ERROR', responce.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in responce" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
        <span class="red--text">
          Column or some fields are found Empty! do you want to Proceed
          with Parameter creation( upload )
        </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="createParamsBtn"
            :loading="deleting"
          >
            Yes
          </v-btn>
          <!-- <v-btn
            color="error"
            class="text-none"
            @click="cancleCreation"
            :loading="deleting"
          >
            Cancel
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'Confirmation-parameter',
  data() {
    return {
      recordSelected: null,
      deleting: false,
      default: false,
      dialog: false,
      payloadData: null,
    };
  },
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    responce: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.$root.$on('parameterCreation', (data) => {
      this.responce = [];
      this.dialog = data;
    });
    this.$root.$on('payload', (data) => {
      this.payloadData = data;
    });
    this.$root.$on('successPayload', (data) => {
      const success = data;
      if (success) {
        this.createParamsBtn();
      }
    });
  },
  beforeDestroy() {
    this.$root.$off('successPayload', false);
    this.responce = [];
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfiguration', ['setCreateParam']),
    ...mapActions('parameterConfiguration', ['createParameterList']),
    async createParamsBtn() {
      const createResult = await this.createParameterList(this.payloadData);
      this.dialog = false;
      this.payloadData = [];
      if (createResult) {
        this.setCreateParam(true);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'IMPORT_PARAMETER_LIST',
        });
        this.payloadData = [];
        this.responce = [];
        this.$root.$emit('getListofParams', true);
      } else {
        this.setCreateParam(false);
        this.responce = [];
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SOMETHING_WRONG_UPLOADING',
        });
      }
    },
    async cancleCreation() {
      this.dialog = false;
      this.responce = [];
      this.$root.$emit('clearResponce', true);
    },
  },
};
</script>
