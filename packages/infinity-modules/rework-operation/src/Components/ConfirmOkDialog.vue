<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
    <v-btn v-on="on"
          small color="primary"
          class="text-none ml-2" @click="checkMainId()">
            {{ $t('displayTags.buttons.confirmok') }}
    </v-btn>
    </template>
      <v-card>
        <v-card-title class="headline">{{ $t('Comfirm OK') }}
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Confirm OK?
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
import { mapMutations, mapActions } from 'vuex';

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
    ...mapActions('reworkOperation', ['updateOverAllResultPartStatus', 'updateOverAllResult', 'getReworkList']),
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
      const payload = {
        query: `?query=mainid=="${this.rework.enterManinId}"&pagesize=1`,
        payload: {
          overallresult: 1,
        },
      };
      // console.log(payload);
      await this.updateOverAllResultPartStatus(payload);
      const payloadRework = {
        query: this.rework.reworkinfo[0]._id,
        payload: {
          overallresult: 1,
        },
      };
      // console.log(payloadRework);
      await this.updateOverAllResult(payloadRework);
      await this.getReworkList('?query=overallresult!="1"');
      this.dialog = false;
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
