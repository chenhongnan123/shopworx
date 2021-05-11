<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addsolution"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('solution.main.dialogtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 250px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            :label="$t('solution.main.header.name')"
            prepend-icon="mdi-account-box-outline"
            v-model="solutionObj.name"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :rules="rules.version"
            :label="$t('solution.main.header.version')"
            prepend-icon="mdi-badge-account-horizontal-outline"
            v-model="solutionObj.version"
            type="number"
          ></v-text-field>
          <v-autocomplete
            clearable
            :label="$t('solution.main.header.type')"
            :items="solutiontypeList"
            :disabled="saving"
            v-model="solutionObj.type"
            item-text="name"
            item-value="name"
            prepend-icon="mdi-account-supervisor-circle-outline"
            :rules="rules.type"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('solution.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="
            !solutionObj.name &&
              !solutionObj.departmentid &&
              !solutionObj.positionid &&
              !solutionObj.code
          "
          :loading="saving"
          @click="saveSolution"
        >
          {{ $t('solution.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  name: 'AddSolutionDialog',
  data() {
    return {
      solutionObj: {},
      rules: {
        name: [(v) => !!v || 'Name is required'],
        type: [(v) => !!v || 'Type is required'],
        version: [(v) => !!v || 'Version is required'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('solution', ['filter', 'addSolutionDialog', 'solutiontypeList', 'assets']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addSolutionDialog;
      },
      set(val) {
        this.setAddSolutionDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('solution', ['setAddSolutionDialog']),
    ...mapActions('solution', ['createSolution', 'getRecords']),
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      return query;
    },
    async saveSolution() {
      const { solutionObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        const payload = {
          ...solutionObj,
          assetid: 0,
          createdby: this.userName,
          createdtime: new Date().getTime(),
        };
        this.saving = true;
        const solution = await this.createSolution(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (solution) {
          this.getRecords(this.getQuery());
          Object.keys(this.solutionObj).forEach((k) => {
            this.solutionObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_SOLUTION',
          });
        }
        this.dialog = false;
      }
    },
  },
};
</script>
<style lang="sass">
#clicktoupload
  margin: 0 auto
  border: 2px dashed #00bcd4
  cursor: pointer
  height: 200px
  width: 200px
  line-height: 200px
  text-align: center
</style>
