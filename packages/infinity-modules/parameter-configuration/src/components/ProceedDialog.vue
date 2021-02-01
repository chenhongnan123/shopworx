<template>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Confirmation?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
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
          {{ $tc('EMPTY_COLUMN_ERROR', responce.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in responce" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
        <span class="red--text">
          Column or some fields are found Empty! do you want to Preceed
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
          <v-btn
            color="error"
            class="text-none"
            @click="cancleCreation"
            :loading="deleting"
          >
            Cancle
          </v-btn>
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
      header: [
        { text: 'Row', value: 'row', width: 120 },
        { text: 'Tag', value: 'tag', width: 120 },
      ],
    };
  },
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    responce: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.$root.$on('parameterCreation', (data) => {
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
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfiguration', ['setCreateParam']),
    ...mapActions('parameterConfiguration', ['createParameterList']),
    async createParamsBtn() {
      const createResult = await this.createParameterList(this.payloadData);
      this.setCreateParam(createResult);
      this.dialog = false;
      if (createResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'IMPORT_PARAMETER_LIST',
        });
        this.payloadData = [];
        this.$root.$emit('getListofParams', true);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SOMETHING_WRONG_UPLOADING',
        });
      }
    },
    async cancleCreation() {
      this.dialog = false;
      document.getElementById('uploadFiles').value = null;
    },
  },
};
</script>
