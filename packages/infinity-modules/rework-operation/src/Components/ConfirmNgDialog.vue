<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
    <v-btn v-on="on"
    small color="warning" class="text-none ml-2" @click="checkMainId()">
            {{ $t('displayTags.buttons.confirmng') }}
    </v-btn>
    </template>
      <v-card>
        <v-card-title class="headline">{{ $t('Comfirm NG') }}
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Confirm NG?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnUpdateOverAllResult"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      newSubLine: {},
      assetId: 4,
      default: false,
      dialog: false,
    };
  },
  props: {
    rework: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('reworkOperation', ['componantList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('reworkOperation',
      ['setReworkList',
        'setComponentList',
        'setSingleNgCodeConfig',
        'setDisableSave',
        'setRoadmapDetailsList',
        'setPartStatusList',
        'setSelectedReworkRoadmap',
      ]),
    ...mapActions('reworkOperation',
      ['updateOverAllResultPartStatus',
        'updateOverAllResult',
        'updateComponentById',
        'deletePartStatus',
        'createOrUpdateManidStore',
        'deleteRecord',
      ]),
    async checkMainId() {
      if (this.rework.enterManinId) {
        this.dialog = true;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MAINID_EMPTY',
        });
      }
      this.dialog = false;
    },
    async btnUpdateOverAllResult() {
      // console.log(this.rework);
      const payloadRework = {
        query: this.rework.reworkinfo[0]._id,
        payload: {
          overallresult: 1,
        },
      };
      // console.log(payloadRework);
      await this.updateOverAllResult(payloadRework);
      const { productname, mainid, ordernumber } = this.rework.reworkinfo[0];
      if (productname === '49180-04900') {
        // Delete PartStatus
        await this.deletePartStatus(mainid);
        // Store Mainid
        const payloadMainidstore = {
          payload: {
            mainid,
            ordernumber,
            status: 0,
          },
          query: `?query=mainid=="${mainid}"%26%26ordernumber=="${ordernumber}"`,
        };
        await this.createOrUpdateManidStore({
          payload: payloadMainidstore,
        });
      } else {
        const payload = {
          query: `?query=mainid=="${this.rework.enterManinId}"&pagesize=1`,
          payload: {
            overallresult: 2,
          },
        };
        // console.log(payload);
        await this.updateOverAllResultPartStatus(payload);
      }
      this.componantList.forEach(async (element) => {
        if (element.qualitystatus === 5) {
          const payload = {
            id: element._id,
            name: 'component',
          };
          await this.deleteRecord(payload);
        } else {
          const payloadComponent = {
            query: element._id,
            payload: {
              qualitystatus: element.qualitystatus,
            },
          };
          await this.updateComponentById(payloadComponent);
        }
      });
      this.dialog = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.rework = [];
      this.setDisableSave(false);
      this.setSingleNgCodeConfig([]);
      this.setComponentList([]);
      this.setRoadmapDetailsList([]);
      this.setPartStatusList([]);
      this.setSelectedReworkRoadmap({});
    },
  },
};
</script>
