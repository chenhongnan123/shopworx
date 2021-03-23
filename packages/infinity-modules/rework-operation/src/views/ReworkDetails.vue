<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>{{ $t('displayTags.reworkDetails') }}</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <v-container fluid class="py-0">
      <v-row justify="center">
        <v-col cols="12" md="7" justify="start">
            <div style="float:left;width: 246px;">
              <v-text-field class="text-none ml-2"
                :label="$t('Main ID')"
                v-on:keyup.enter="submitMainid"
                v-model="rework.enterManinId"
              ></v-text-field>
         </div>
        </v-col>
        <v-col cols="12" md="5" justify="end">
         <div style="float:right;" class="mt-5">
          <ConfirmRework :rework="rework" v-if="disableSave"/>
          <ConfirmOk :rework="rework" v-if="disableSave"/>
          <ConfirmNG :rework="rework" v-if="disableSave"/>
         </div>
        </v-col>
      </v-row>
      <v-card flat class="transparent">
      <v-row>
        <v-col cols="12" md="6">
       <v-card>
        <v-card-text>
          <v-col>
            <span class="headline font-weight-regular success--text">
              {{ $t('Product History Info') }}
            </span>
            <v-row no-gutters>
            <v-col cols="12" md="4" class="py-2">
              <div>
                {{ $t('Created Time') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{partStatusList[0].createdTimestamp}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
              <div>
                {{ $t('Previous Order') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{partStatusList[0].ordername}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
              <div>
                {{ $t('NG Description') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{ngCodeDetails.filter((f) => f.ngcode ===
                partStatusList[0].checkoutngcode)[0].ngdescription}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <div>
                {{ $t('NG Sub Station') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{partStatusList[0].substationname}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
              <div>
                {{ $t('NG Code') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{partStatusList[0].checkoutngcode}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <div>
                {{ $t('Reworkable') }}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{ngCodeDetails.filter((f) => f.ngcode ===
                partStatusList[0].checkoutngcode)[0].reworkable}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
              <div>
                {{ $t('Product Type' )}}
              </div>
              <div class="title" v-if="partStatusList.length">
                {{partStatusList[0].producttypename}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
            </v-col>
            <!-- <v-col cols="12" md="4" class="py-2">
            </v-col> -->
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <v-col>
            <span class="headline font-weight-regular success--text">
              {{ $t('Rework Description') }}
            </span>
            <v-row no-gutters>
            <v-col cols="12" md="4" class="py-2">
              <div>
                {{ $t('Target Substation') }}
              </div>
              <div class="title" v-if="roadmapDetailsList.length">
                {{roadmapDetailsList[roadmapDetailsList.length - 1].substationname}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <div>
               {{ $t('Process Code') }}
              </div>
              <div class="title" v-if="roadmapDetailsList.length">
                {{roadmapDetailsList[roadmapDetailsList.length - 1].process}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
            </v-col>
            </v-row>
             <div>
                {{ $t('Select Rework Roadmap') }}
            </div>
            <div class="title" v-if="singlengcodeconfig.length">
                <v-select
                  hide-details
                  :label="$t('Select Rework Roadmap')"
                  :items="roadmapList"
                  return-object
                  item-text="name"
                  v-model="selectedReworkRoadmap"
                  @change="onReworkRoadmapSelected()"/>
            </div>
            <div class="title" v-else>
              {{'-'}}
            </div>
            <div>
                {{ $t('Rework Description') }}
              </div>
              <div class="title" v-if="selectedReworkRoadmap">
                {{selectedReworkRoadmap.reworkdescription}}
              </div>
              <div class="title" v-else>
                {{'-'}}
              </div>
          </v-col>
        </v-card-text>
    </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-card :class="title === null ? 'mt-8' : ''">
                <v-card-text>
                  <v-col>
                    <span class="headline font-weight-regular success--text">
                      {{ $t('Current Info') }}
                    </span>
                    <v-row no-gutters>
                      <v-col cols="12" md="4" class="py-2">
                        <div>
                          {{ $t('Running Order') }}
                        </div>
                        <div class="title" v-if="singlengcodeconfig.length">
                          {{checkMainId[0].ordername}}
                        </div>
                        <div class="title" v-else>
                          {{'-'}}
                        </div>
                        <div>
                          {{ $t('Running Product Type') }}
                        </div>
                        <div class="title" v-if="singlengcodeconfig.length">
                          {{checkMainId[0].productname}}
                        </div>
                        <div class="title" v-else>
                          {{'-'}}
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                  </v-col>
                    <v-data-table
                      v-model="reworkdetails"
                      :headers="headers"
                      :items="componantList"
                      item-key="_id"
                      :single-select="true"
                      >
                      <template v-slot:item.rework="{ item }">
                        <v-checkbox
                            v-if="item.boundstatus === 1"
                            primary
                            hide-details
                            v-model="item.rework"
                            @change="checkBoxRework($event, item)"
                            ></v-checkbox>
                      </template>
                      <template v-slot:item.quality="{ item }">
                        <v-checkbox
                            v-if="item.boundstatus === 1 && item.reworkstatus !== 1"
                            primary
                            hide-details
                            v-model="item.quality"
                            @change="checkBoxQuality($event, item)"
                            ></v-checkbox>
                      </template>
                      <template v-slot:item.qualitystatus="{ item }">
                        <v-select
                          hide-details
                          :items="setQualityStatusList"
                          item-value="value"
                          item-text="name"
                          v-model="item.qualitystatus"/>
                      </template>
                      <template v-slot:item.bound>
                        <span>1</span>
                      </template>
                      <template v-slot:item.checkquality="{ item }">
                        <span v-if="item.checkquality">{{ qualityStatusList
                          .find((f) => f.value === item.checkquality).name }}</span>
                        <span v-else> Default </span>
                      </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import ConfirmRework from '../Components/ConfirmReworkDialog.vue';
import ConfirmOk from '../Components/ConfirmOkDialog.vue';
import ConfirmNG from '../Components/ConfirmNgDialog.vue';

export default {
  name: 'ReworkDetails',
  components: {
    ConfirmRework,
    ConfirmOk,
    ConfirmNG,
  },
  data() {
    return {
      qualityStatusList: [
        {
          name: 'Default',
          value: 0,
        },
        {
          name: 'OK',
          value: 1,
        },
        {
          name: 'NG',
          value: 2,
        },
        {
          name: 'Scraped',
          value: 3,
        },
        {
          name: 'Reworked',
          value: 4,
        },
        {
          name: 'Separated',
          value: 5,
        },
      ],
      setQualityStatusList: [
        {
          name: 'Scraped',
          value: 3,
        },
        {
          name: 'Reworked',
          value: 4,
        },
        {
          name: 'Separated',
          value: 5,
        },
      ],
      headers: [
        {
          text: this.$t('Component'),
          value: 'componentname',
        },
        {
          text: this.$t('Component Value'),
          value: 'componentvalue',
        },
        {
          text: this.$t('Sub-Station name'),
          value: 'substationname',
        },
        { text: this.$t('Current Quality'), value: 'checkquality' },
        { text: this.$t('Set Quality'), value: 'qualitystatus' },
        // { text: 'Bound?', value: 'boundstatus' },
        // { text: 'Keep?', value: 'rework' },
        // { text: 'Good?', value: 'quality' },
      ],
      reworkItem: null,
      stationRecipeList: [],
      saving: false,
      loadingDetails: false,
      enterManinId: '',
      reworkable: null,
      rework: {},
      checkMainId: null,
      selectedReworkRoadmap: null,
    };
  },
  async created() {
    // await this.getComponentRecords(`?query=mainid=="${this.reworkItem.mainid}"`);
    // await this.getNgCodeRecords(`?query=ngcode==${this.reworkItem.checkoutngcode}`);
    await this.getNgCodeRecords('');
    // this.getSingleNgCodeDetail('');
    // this.getComponentRecords('');
    await this.getRoadmapList('?query=roadmaptype=="Rework"');
    await this.getReworkList('?query=overallresult!="1"');
    await this.getRunningOrder('?query=orderstatus=="Running"');
  },
  beforeDestroy() {
    this.setReworkList([]);
    this.setComponentList([]);
    this.setSingleNgCodeConfig([]);
  },
  computed: {
    ...mapState('reworkOperation', ['ngCodeDetails',
      'componantList',
      'singlengcodeconfig',
      'reworkList',
      'disableSave',
      'runningOrderList',
      'normalRoadMapDetails',
      'reworkRoadMapDetails',
      'partStatusList',
      'roadmapList',
      'roadmapDetailsList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('reworkOperation',
      ['setReworkList',
        'setComponentList',
        'setSingleNgCodeConfig',
        'setDisableSave',
        'setSelectedReworkRoadmap',
      ]),
    ...mapActions('reworkOperation', ['getComponentRecords',
      'getNgCodeRecords',
      'getSingleNgCodeDetail',
      'getReworkList',
      'getRunningOrder',
      'getNormalRoadMapDetails',
      'getReworkRoadmapDetails',
      'getPartStatusLastEntry',
      'updateRecordById',
      'getRoadmapList']),
    async onReworkRoadmapSelected() {
      await this.getReworkRoadmapDetails(`?query=roadmapid=="${this.selectedReworkRoadmap.id}"`);
      this.setSelectedReworkRoadmap(this.selectedReworkRoadmap);
      // await this.getReworkRoadMapDetails(`?query=roadmapid=="${this.selectedReworkRoadmap.id}"`);
      // console.log(this.normalRoadMapDetails);
      // const item = this.normalRoadMapDetails.find((i) => i.substationid
      // === this.reworkRoadMapDetails[this.reworkRoadMapDetails.length - 1].substationid);
      // const indexItem = this.normalRoadMapDetails.indexOf(item);
      // if (this.normalRoadMapDetails[indexItem + 1]) {
      //   this.rework.substationid = this.normalRoadMapDetails[indexItem + 1].substationid;
      //   this.rework.substationname = this.normalRoadMapDetails[indexItem + 1].substationname;
      // } else if (this.normalRoadMapDetails[indexItem]) {
      //   this.rework.substationid = this.normalRoadMapDetails[indexItem].substationid;
      //   this.rework.substationname = this.normalRoadMapDetails[indexItem].substationname;
      // }
    },
    async updateQualityStatus(item) {
      console.log(item);
      const payload = {
        id: item._id,
        payload: {
          qualitystatus: item.qualitystatus.value,
        },
      };
      this.saving = true;
      const updateResult = await this.updateRecordById(payload);
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'VALUES_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'VALUES_UPDATE_ERROR',
        });
      }
    },
    checkBoxQuality(event, item) {
      if (item.boundstatus === 1) {
        if (item.reworkstatus === 1) {
          item.qualitystatus = 0;
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_REWORK',
          });
        } else if (event) {
          item.qualitystatus = 1;
        } else {
          item.qualitystatus = 0;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'BOUND_STATUS_NOT_PRESENT',
        });
      }
    },
    checkBoxRework(event, item) {
      if (item.boundstatus === 1) {
        if (event) {
          item.reworkstatus = 1;
          item.quality = false;
        } else {
          item.reworkstatus = 0;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'BOUND_STATUS_NOT_PRESENT',
        });
      }
    },
    async submitMainid() {
      await this.getPartStatusLastEntry(`?query=mainid=="${this.rework.enterManinId}"&pagesize=1`);
      await this.getNormalRoadMapDetails(`?query=roadmapid=="${this.runningOrderList[0].roadmapid}"`);
      this.checkMainId = this.reworkList
        .filter((i) => i.mainid === this.rework.enterManinId);
      if (this.checkMainId.length > 0) {
        // await this.getReworkList(`?query=mainid=="${this.rework.enterManinId}"`);
        await this.getComponentRecords(`?query=mainid=="${this.rework.enterManinId}"`);
        const ngCode = this.checkMainId[0].checkoutngcode;
        const singlengcodeconfig = await this.getSingleNgCodeDetail(`?query=ngcode==${ngCode}`);
        // console.log(singlengcodeconfig);
        if (singlengcodeconfig.length === 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'NO_SUMMARY',
          });
          this.setDisableSave(false);
          this.setSingleNgCodeConfig([]);
          this.setComponentList([]);
          this.selectedReworkRoadmap = null;
        } else {
          this.rework.ngcodedata = singlengcodeconfig;
          this.rework.reworkinfo = this.checkMainId;
          this.setDisableSave(true);
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MAINID_NOT_PRESENT',
        });
        this.setDisableSave(false);
        this.setSingleNgCodeConfig([]);
        this.setComponentList([]);
      }
    },
  },
};
</script>
<style>
.tableHeader{
  background: gray;
  font-size: 22px;
}
</style>
