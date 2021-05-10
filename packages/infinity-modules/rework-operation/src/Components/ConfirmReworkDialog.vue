<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <!-- <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$delete'"
    class="float-right" color="error"></v-icon> -->
    <template v-slot:activator="{ on }">
    <v-btn v-on="on"
    small color="primary"
          class="text-none" @click="checkMainId(true)">
            {{ $t('displayTags.buttons.confirmrework') }}
    </v-btn>
    </template>
      <v-card>
        <v-card-title class="headline">{{ $t('Comfirm Rework') }}
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Confirm Rework?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnConfirmRework"
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
    ...mapState('reworkOperation', ['runningOrderList', 'selectedReworkRoadmap', 'componantList']),
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
    ...mapActions('reworkOperation', ['addPartStatusRecord',
      'getRunningOrder',
      'updateOverAllResult',
      'getReworkList',
      'updateComponentById']),
    async checkMainId() {
      if (this.rework.enterManinId) {
        this.dialog = true;
      } else {
        this.dialog = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MAINID_EMPTY',
        });
      }
    },
    async btnConfirmRework() {
      // await this.getRunningOrder('?orderstatus="Running"');
      if (this.runningOrderList[0].productname === this.rework.reworkinfo[0].productname) {
        // let substationidValue = '';
        // let substationidName = '';
        // if (this.rework.substationid) {
        //   substationidValue = this.rework.substationid;
        //   substationidName = this.rework.substationname;
        // }
        const object = {
          checkoutngcode: this.rework.ngcodedata[0].ngcode,
          lineid: this.rework.ngcodedata[0].lineid,
          sublineid: this.rework.reworkinfo[0].sublineid,
          // substationid: substationidValue,
          // substationname: substationidName,
          linename: this.rework.ngcodedata[0].linename,
          mainid: this.rework.enterManinId,
          roadmapid: this.selectedReworkRoadmap.id,
          ordername: this.rework.reworkinfo[0].ordername,
          ordernumber: this.rework.reworkinfo[0].ordernumber,
          ordertype: this.rework.reworkinfo[0].ordertype,
          customername: this.rework.reworkinfo[0].customername,
          producttypename: this.rework.reworkinfo[0].productname,
          productid: this.rework.reworkinfo[0].productid,
          overallresult: 1,
          modestatus: 1,
          assetid: 4,
        };
        await this.addPartStatusRecord(object);
        const payload = {
          query: this.rework.reworkinfo[0]._id,
          payload: {
            overallresult: 1,
          },
        };
        // console.log(payload);
        await this.updateOverAllResult(payload);
        // this.componantList.filter((f) => f.boundstatus === 1).forEach(async (element) => {
        //   let reworkS = 2;
        //   let qualityS = 2;
        //   if (element.reworkstatus === true) {
        //     reworkS = 1;
        //   }
        //   if (element.qualitystatus === true) {
        //     qualityS = 1;
        //   }
        //   if (element.reworkstatus === 1) {
        //     reworkS = 1;
        //   }
        //   if (element.qualitystatus === 1) {
        //     qualityS = 1;
        //   }
        //   let payloadComponent = {};
        //   if (element.quality === false) {
        //     payloadComponent = {
        //       query: element._id,
        //       payload: {
        //         reworkstatus: reworkS,
        //       },
        //     };
        //   } else {
        //     payloadComponent = {
        //       query: element._id,
        //       payload: {
        //         reworkstatus: reworkS,
        //         qualitystatus: qualityS,
        //       },
        //     };
        //   }
        //   await this.updateComponentById(payloadComponent);
        // });
        this.componantList.forEach(async (element) => {
          const payloadComponent = {
            query: element._id,
            payload: {
              qualitystatus: element.qualitystatus,
              isbind: element.isbind,
            },
          };
          await this.updateComponentById(payloadComponent);
        });
        await this.getReworkList('?query=overallresult!="1"');
        this.dialog = false;
        this.rework = [];
        this.setDisableSave(false);
        this.setSingleNgCodeConfig([]);
        this.setComponentList([]);
        this.setRoadmapDetailsList([]);
        this.setPartStatusList([]);
        this.setSelectedReworkRoadmap(null);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NO_PRODUCT_TYPE',
        });
      }
    },
  },
};
</script>
