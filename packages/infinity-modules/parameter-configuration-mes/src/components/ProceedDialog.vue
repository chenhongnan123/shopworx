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
      <v-expansion-panel v-if="responce.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.EMPTY_COLUMN_ERROR_REQUIRED_FIELD', responce.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in responce" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="optionalRes.length > 0">
      <v-expansion-panel-header class="pa-0 ma-0 warning--text">
          {{ $t('error.EMPTY_COLUMN_ERROR_OPTIONAL_FIELD', optionalRes.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in optionalRes" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="duplicateBnum.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_BIT_NUM_ERROR', duplicateBnum.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in duplicateBnum" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="duplicateStartnum.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_START_NUM_ERROR', duplicateStartnum.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in duplicateStartnum" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="dupDbAddress.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_DB_ADDRESS_ERROR', dupDbAddress.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in dupDbAddress" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="dummyCombo.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_COMBINATION_ERROR', dummyCombo.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in dummyCombo" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="duplicateCombination.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_COMBINATION_FROM_DB', duplicateCombination.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in duplicateCombination" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="paramLength.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.PARAMETER_NAME_LENGTH_EXCEEDED', paramLength.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in paramLength" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="dummyNames.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_PARAMETER_FOUND', dummyNames.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in dummyNames" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="dummyParamsDb.length > 0">
        <v-expansion-panel-header class="pa-0 ma-0 error--text">
          {{ $t('error.DUPLICATE_PARAMETER_FOUND_DB', dummyParamsDb.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in dummyParamsDb" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="createParamsBtn"
            :loading="deleting"
            :disabled="yesBtnDisable"
          >
            Continue
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
      yesBtnDisable: true,
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
    optionalRes: {
      type: Array,
      required: true,
    },
    duplicateBnum: {
      type: Array,
      default: () => [],
    },
    duplicateStartnum: {
      type: Array,
      default: () => [],
    },
    dummyCombo: {
      type: Array,
      default: () => [],
    },
    duplicateCombination: {
      type: Array,
      default: () => [],
    },
    dupDbAddress: {
      type: Array,
      default: () => [],
    },
    paramLength: {
      type: Array,
      default: () => [],
    },
    dummyNames: {
      type: Array,
      default: () => [],
    },
    dummyParamsDb: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    responce: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    dupDbAddress: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    dummyCombo: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    duplicateCombination: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    duplicateStartnum: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    duplicateBnum: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    paramLength: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    dummyNames: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
    dummyParamsDb: {
      handler(val) {
        if (val.length > 0) {
          this.yesBtnDisable = true;
        } else {
          this.yesBtnDisable = false;
        }
      },
    },
  },
  created() {
    this.duplicateBnum = [];
    this.duplicateStartnum = [];
    this.dupDbAddress = [];
    this.paramLength = [];
    this.dummyNames = [];
    this.dummyCombo = [];
    this.dummyParamsDb = [];
    this.duplicateCombination = [];
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
  beforeDestroy() {
    this.$root.$off('successPayload', false);
    this.duplicateBnum = [];
    this.responce = [];
    this.optionalRes = [];
    this.duplicateBnum = [];
    this.duplicateStartnum = [];
    this.dupDbAddress = [];
    this.paramLength = [];
    this.dummyNames = [];
    this.dummyParamsDb = [];
    this.dummyCombo = [];
    this.duplicateCombination = [];
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfigurationMes', ['setCreateParam']),
    ...mapActions('parameterConfigurationMes', ['createParameterList']),
    async createParamsBtn() {
      this.deleting = true;
      const createResult = await this.createParameterList(this.payloadData);
      this.dialog = false;
      this.payloadData = [];
      if (createResult) {
        // this.setCreateParam(true);
        this.$root.$emit('passedFlagOfValidations', true);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'IMPORT_PARAMETER_LIST',
        });
        this.payloadData = [];
        this.$root.$emit('getListofParams', true);
        this.$root.$emit('clearResponce', true);
      } else {
        this.setCreateParam(false);
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SOMETHING_WRONG_UPLOADING',
        });
      }
      this.deleting = false;
    },
    async cancleCreation() {
      this.dialog = false;
      this.responce = [];
      this.optionalRes = [];
      this.duplicateBnum = [];
      this.duplicateStartnum = [];
      this.dupDbAddress = [];
      this.paramLength = [];
      this.dummyNames = [];
      this.dummyParamsDb = [];
      this.dummyCombo = [];
      this.duplicateCombination = [];
      this.$root.$emit('clearResponce', true);
    },
  },
};
</script>
<style scoped>
  .v-expansion-panel__header {
     color:yellow
  }
</style>
