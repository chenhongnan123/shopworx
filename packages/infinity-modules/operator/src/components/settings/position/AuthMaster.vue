<template>
  <v-dialog
    id="auth"
    v-model="dialog"
    persistent
    scrollable
    max-width="1400px"
    transition="dialog-transition"
  >
    <v-card style="height: 600px;">
      <v-card-title>
        <span>
          {{ $t(`operator.settings.auth`) }}
        </span>
      </v-card-title>
      <v-card-text style="height: calc(100% - 80px); overflow: auto;">
        <v-row>
          <v-col cols="5">
            {{ $t(`operator.general.noselected`) }}
          </v-col>
          <v-col cols="2"> </v-col>
          <v-col cols="5">
            {{ $t(`operator.general.selected`) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-data-table
              :headers="headers"
              item-key="id"
              show-select
              class="elevation-1"
              height="400"
              fixed-header
              hide-default-footer
              :items="noBind"
              disable-pagination
              v-model="leftSelected"
              sort-by="id"
            >
            </v-data-table>
          </v-col>
          <v-col cols="2" class="align-self">
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="toRight">
                <v-icon small left>mdi-chevron-right</v-icon>
                {{ $t(`operator.general.include`) }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="toLeft">
                <v-icon small left>mdi-chevron-left</v-icon>
                {{ $t(`operator.general.exclude`) }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Right">
                <v-icon small left>mdi-chevron-double-right</v-icon>
                {{ $t(`operator.general.allinclude`) }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Left">
                <v-icon small left>mdi-chevron-double-left</v-icon>
                {{ $t(`operator.general.allexclude`) }}
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="5">
            <v-data-table
              :headers="headers"
              item-key="id"
              show-select
              class="elevation-1"
              height="400"
              fixed-header
              hide-default-footer
              :items="binded"
              disable-pagination
              v-model="rightSelected"
              sort-by="id"
            >
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t(`operator.general.cancel`) }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="false"
          :loading="saving"
          @click="saveBind"
        >
          {{ $t(`operator.general.save`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import _ from 'lodash';

export default {
  name: 'Auth',
  data() {
    return {
      headers: [
        { text: this.$t('operator.settings.code'), value: 'code' },
        {
          text: this.$t('operator.settings.name'),
          value: 'name',
        },
        { text: this.$t('operator.settings.description'), value: 'description' },
      ],
      saving: false,
      valid: false,
      leftSelected: [],
      rightSelected: [],
      binded: [],
      noBind: [],
      loading: false,
    };
  },
  computed: {
    ...mapState('operator', [
      'positionList',
      'authcodeList',
      'positionauthList',
      'authDialog',
      'selectedPosition',
    ]),
    authcodes: {
      get() {
        // eslint-disable-next-line arrow-body-style
        return this.authcodeList.map((item) => {
          return {
            ...item,
            status: true,
          };
        });
      },
      set() {},
    },
    dialog: {
      get() {
        return this.authDialog;
      },
      set(val) {
        this.setAuthDialog(val);
      },
    },
  },
  watch: {
    async authDialog(val) {
      if (val) {
        if (val) {
          this.loading = true;
          await this.getPositionAuths(`?query=positionid=="${this.selectedPosition.id}"`);
          this.loading = false;
          // reload bind & unbind
          this.init();
        }
      }
    },
  },
  methods: {
    ...mapMutations('operator', ['setAuthDialog']),
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('operator', [
      'updateRecord',
      'deleteRecord',
      'createRecord',
      'getPositions',
      'getPositionAuths',
      'getAuthCodes',
      'postBulkRecords',
      'deleteRecordById',
    ]),
    toRight() {
      if (this.leftSelected.length > 0) {
        const ls = [...this.leftSelected];
        this.leftSelected = [];

        const left = [...this.noBind];
        _.pull(left, ...ls);
        this.noBind = left;

        const right = [...this.binded];

        this.binded = _.concat(right, ...ls);
      }
    },
    all2Right() {
      this.leftSelected = [];
      this.rightSelected = [];
      const left = [...this.noBind];
      this.noBind = [];

      const right = [...this.binded];

      this.binded = _.concat(right, ...left);
    },
    toLeft() {
      if (this.rightSelected.length > 0) {
        const rs = [...this.rightSelected];
        this.rightSelected = [];

        const right = [...this.binded];
        _.pull(right, ...rs);
        this.binded = right;

        const left = [...this.noBind];
        this.noBind = _.concat(left, ...rs);
      }
    },
    all2Left() {
      this.leftSelected = [];
      this.rightSelected = [];

      const right = [...this.binded];
      this.binded = [];

      const left = [...this.noBind];
      this.noBind = _.concat(left, ...right);
    },
    async saveBind() {
      // to remove bind
      // eslint-disable-next-line arrow-body-style
      const toremove = this.noBind.filter((item) => {
        return Object.prototype.hasOwnProperty.call(item, 'positionid');
      });
      // add new bind
      // eslint-disable-next-line arrow-body-style
      const toadd = this.binded.filter((item) => {
        return !Object.prototype.hasOwnProperty.call(item, 'positionid');
      });
      if (toremove.length < 1 && toadd.length < 1) {
        return;
      }
      // eslint-disable-next-line arrow-body-style
      const removeList = toremove.map((item) => {
        return new Promise((resolve) => {
          const _id = item.bindid;
          if (_id) {
            const result = this.deleteRecordById({
              id: _id,
              element: 'positionauth',
            });
            resolve(result);
          }
        });
      });

      const addList = new Promise((resolve) => {
        // eslint-disable-next-line arrow-body-style
        const payloads = toadd.map((item) => {
          return {
            assetid: 0,
            authcode: item.code,
            positionid: this.selectedPosition.id,
            positionname: this.selectedPosition.name,
          };
        });
        if (payloads.length < 1) {
          resolve();
          return;
        }
        const result = this.postBulkRecords({
          payload: payloads,
          name: 'positionauth',
        });
        resolve(result);
      });
      this.saving = true;
      const result = await Promise.all([...removeList, addList]);
      this.saving = false;
      if (result) {
        await this.getPositionAuths(`?query=positionid=="${this.selectedPosition.id}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'Authorization',
        });
      }
      this.dialog = false;
    },
    init() {
      this.binded = this.positionauthList
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          const { _id } = item;
          return {
            bindid: _id,
            ...item,
            ...this.authcodeList.filter((autocode) => autocode.code === item.authcode)[0],
          };
        });
      const left = [...this.authcodeList];
      // prettier-ignore
      // eslint-disable-next-line max-len,arrow-body-style
      this.noBind = left.filter((item) => !_.find(this.binded, (o) => { return o.authcode === item.code; }));
    },
  },
};
</script>
