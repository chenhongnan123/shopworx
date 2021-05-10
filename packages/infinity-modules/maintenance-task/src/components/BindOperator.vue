<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="bindoperator"
    v-model="dialog"
    persistent
    scrollable
    transition="dialog-transition"
    width="1000"
  >
    <v-card height="605px">
      <v-card-title class="primary">
        <span class="white--text"> {{ $t('maintenancetask.bindtitle') }} </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="5">
            {{ $t('maintenancetask.general.noselected') }}
          </v-col>
          <v-col cols="2"> </v-col>
          <v-col cols="5">
            {{ $t('maintenancetask.general.selected') }}
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
                {{ $t('maintenancetask.general.include') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="toLeft">
                <v-icon small left>mdi-chevron-left</v-icon>
                {{ $t('maintenancetask.general.exclude') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Right">
                <v-icon small left>mdi-chevron-double-right</v-icon>
                {{ $t('maintenancetask.general.allinclude') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Left">
                <v-icon small left>mdi-chevron-double-left</v-icon>
                {{ $t('maintenancetask.general.allexclude') }}
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
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('maintenancetask.general.cancel') }}
        </v-btn>
        <v-btn color="primary" class="text-none" :loading="saving" @click="saveBind">
          {{ $t('maintenancetask.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapState,
  // mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import _ from 'lodash';

export default {
  name: 'BindOperator',
  data() {
    return {
      saving: false,
      valid: false,
      leftSelected: [],
      rightSelected: [],
      binded: [],
      headers: [
        {
          text: this.$t('maintenancetask.operatorheader.id'),
          value: 'id',
        },
        {
          text: this.$t('maintenancetask.operatorheader.name'),
          value: 'operatorname',
        },
        {
          text: this.$t('maintenancetask.operatorheader.code'),
          value: 'operatorcode',
        },
      ],
      noBind: [],
    };
  },
  computed: {
    ...mapState('task', [
      'bindOperatorDialog',
      'operatorList',
      'taskList',
      'taskOperatorList',
      'assets',
    ]),
    ...mapState('user', ['me']),
    taskInfo: {
      get() {
        return this.taskList.filter((item) => item.id === this.taskid)[0];
      },
    },
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.bindOperatorDialog;
      },
      set(val) {
        this.setBindOperatorDialog(val);
      },
    },
  },
  created() {
    this.taskid = this.$route.params.id;
  },
  watch: {
    dialog(val) {
      if (val) {
        // reload bind & unbind
        this.init();
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('task', ['setBindOperatorDialog']),
    ...mapActions('task', ['getTaskOperatorList', 'deleteRecord', 'createOperatorList']),
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
        return Object.prototype.hasOwnProperty.call(item, 'taskid');
      });
      // add new bind
      // eslint-disable-next-line arrow-body-style
      const toadd = this.binded.filter((item) => {
        return !Object.prototype.hasOwnProperty.call(item, 'taskid');
      });
      if (toremove.length < 1 && toadd.length < 1) {
        return;
      }
      // eslint-disable-next-line arrow-body-style
      const removeList = toremove.map((item) => {
        return new Promise((resolve) => {
          const _id = item.bindid;
          if (_id) {
            const result = this.deleteRecord({
              id: _id,
              name: 'taskoperator',
            });
            resolve(result);
          }
        });
      });
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);

      const addList = new Promise((resolve) => {
        // eslint-disable-next-line arrow-body-style
        const payloads = toadd.map((item) => {
          return {
            assetid: getAssetId,
            operatorid: item.id,
            operatorname: item.name,
            taskid: this.taskInfo.id,
          };
        });
        if (payloads.length < 1) {
          resolve();
          return;
        }
        const result = this.createOperatorList(payloads);
        resolve(result);
      });
      this.saving = true;
      const result = await Promise.all([...removeList, addList]);
      this.saving = false;
      if (result) {
        await this.getTaskOperatorList(`?query=taskid=="${this.taskInfo.id}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BIND_STAFF',
        });
      }
      this.dialog = false;
    },
    init() {
      this.binded = this.taskOperatorList
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          const { _id } = item;
          return {
            bindid: _id,
            ...item,
            ...this.operatorList.filter((operator) => operator.id === item.operatorid)[0],
          };
        });
      const left = [...this.operatorList];
      // prettier-ignore
      // eslint-disable-next-line max-len,arrow-body-style
      this.noBind = left.filter((item) => !_.find(this.binded, (o) => { return o.id === item.id; }));
    },
  },
};
</script>
