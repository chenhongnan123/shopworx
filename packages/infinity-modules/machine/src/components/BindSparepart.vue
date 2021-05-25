<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="bindsparepart"
    v-model="dialog"
    persistent
    scrollable
    transition="dialog-transition"
    width="1000"
  >
    <v-card height="605px">
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('machine.sparepart.bindtitle') }}
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="5">
            {{ $t('machine.general.noselected') }}
          </v-col>
          <v-col cols="2"> </v-col>
          <v-col cols="5">
            {{ $t('machine.general.selected') }}
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
                {{ $t('machine.general.include') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="toLeft">
                <v-icon small left>mdi-chevron-left</v-icon>
                {{ $t('machine.general.exclude') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Right">
                <v-icon small left>mdi-chevron-double-right</v-icon>
                {{ $t('machine.general.allinclude') }}
              </v-btn>
            </v-row>
            <v-row class="mb-4">
              <v-btn class="text-none" block @click="all2Left">
                <v-icon small left>mdi-chevron-double-left</v-icon>
                {{ $t('machine.general.allexclude') }}
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
          {{ $t('machine.general.cancel') }}
        </v-btn>
        <v-btn color="primary" class="text-none" :loading="saving" @click="saveBind">
          {{ $t('machine.general.save') }}
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
  name: 'BindSparepart',
  data() {
    return {
      saving: false,
      valid: false,
      leftSelected: [],
      rightSelected: [],
      binded: [],
      headers: [
        {
          text: 'id',
          value: 'id',
        },
        {
          text: 'name',
          value: 'name',
        },
        {
          text: 'description',
          value: 'description',
        },
      ],
      noBind: [],
    };
  },
  computed: {
    ...mapState('machine', [
      'bindSparepartDialog',
      'tab',
      'sparepartbindposition',
      'sparepartList',
    ]),
    ...mapState('user', ['me']),
    ...mapState('machine', ['machineList', 'positionList']),
    machineInfo: {
      get() {
        return this.machineList.filter((item) => item.id === this.machineid)[0];
      },
    },
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.bindSparepartDialog;
      },
      set(val) {
        this.setBindSparepartDialog(val);
      },
    },
    position() {
      return this.positionList[this.tab];
    },
  },
  created() {
    this.machineid = this.$route.params.id;
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
    ...mapMutations('machine', ['setBindSparepartDialog', 'setTab']),
    ...mapActions('machine', [
      'getSparepartbindpositionRecords',
      'deleteRecord',
      'postBulkRecords',
      'getPositionRecords',
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
      const { tab } = this;
      // to remove bind
      // eslint-disable-next-line arrow-body-style
      const toremove = this.noBind.filter((item) => {
        return Object.prototype.hasOwnProperty.call(item, 'machinepositionid');
      });
      // add new bind
      // eslint-disable-next-line arrow-body-style
      const toadd = this.binded.filter((item) => {
        return !Object.prototype.hasOwnProperty.call(item, 'machinepositionid');
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
              name: 'sparepartbindmachineposition',
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
            sparepartid: item.id,
            sparepartcode: item.name,
            sparepartname: item.code,
            machineid: this.machineInfo.id,
            machinename: this.machineInfo.name,
            machinepositionid: this.position.id,
            machinepositionname: this.position.name,
            warehousecode: item.warehousecode,
            warehousename: item.warehousename,
            locationcode: item.locationcode,
            locationname: item.locationname,
          };
        });
        if (payloads.length < 1) {
          resolve();
          return;
        }
        const result = this.postBulkRecords({
          payload: payloads,
          name: 'sparepartbindmachineposition',
        });
        resolve(result);
      });
      this.saving = true;
      const result = await Promise.all([...removeList, addList]);
      this.saving = false;
      if (result) {
        await this.getSparepartbindpositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
        await this.getPositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
        this.setTab(tab);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'BIND_SPAREPART',
        });
      }
      this.dialog = false;
    },
    init() {
      this.binded = this.sparepartbindposition
        .filter(
          // prettier-ignore
          // eslint-disable-next-line max-len
          (item) => item.machineid === this.machineid && item.machinepositionid === this.position.id,
        )
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          const { _id } = item;
          return {
            bindid: _id,
            ...item,
            ...this.sparepartList.filter((part) => part.id === item.sparepartid)[0],
          };
        });
      const left = [...this.sparepartList];
      // prettier-ignore
      // eslint-disable-next-line max-len,arrow-body-style
      this.noBind = left.filter((item) => !_.find(this.binded, (o) => { return o.id === item.id; }));
    },
  },
};
</script>
