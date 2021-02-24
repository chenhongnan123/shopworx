<template>
  <div>
    <portal to="app-header">
      Packaging Management
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
    <v-row class="ma-5">
      <v-col cols="6">
        <v-text-field
          v-model="mainid"
          outlined
          rounded
          clearable
          label="请扫描条码信息。"
          :disabled="loading"
          prepend-inner-icon="mdi-barcode-scan"
          @change="handlePackageRecord"
        ></v-text-field>
        <v-card
        >
          <v-row no-gutters class="px-2">
            <v-col cols="2">
              <v-icon
                large
                :color="['primary', 'success', 'error'][mainidstatus]"
                class="text-h1"
              >
                {{ ['mdi-barcode-scan',
                    'mdi-checkbox-marked-circle-outline',
                    'mdi-alert-box'][mainidstatus] }}
              </v-icon>
            </v-col>
            <v-col cols="8" class="text-center">
              <div class="wrong-code-title mt-3">
                {{['当前条码空白！',
                   '当前条码正确！',
                   '当前条码错误！'][mainidstatus]}}
              </div>
              <div class="wrong-code-subtitle">
                {{['请扫描条码信息。',
                   '请继续打包。',
                   '请检查当前条码。'][mainidstatus]}}
              </div>
            </v-col>
            <v-col cols="2" class="text-center">
              <v-btn
                icon
                @click="show = !show"
                class="mt-7"
              >
                <v-icon style="font-size:50px">
                  {{ show ? 'mdi-arrow-up-drop-circle' : 'mdi-arrow-down-drop-circle' }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-card-text>
                详情:<br/>
                {{detailMessege}}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
        <v-card class="pa-5 mt-5" style="background-color:rgba(245, 247, 247, 1);">
          <v-card class="pa-5">
            <v-stepper>
              <v-stepper-header class="px-2">
                <v-stepper-step
                  step=""
                  complete
                  :rules="!stationinfo.status ? [() => false] :  [() => true]"
                  v-for="(stationinfo, k) in stationinfolist"
                  :key="k"
                >
                </v-stepper-step>
              </v-stepper-header>
            </v-stepper>
            <v-toolbar-title class="ng-station-title" v-if="stationinfolist.length > 0">
              {{stationinfolist.find((stationinfo) => stationinfo.status === 0).name}} 站存在问题
            </v-toolbar-title>
            <v-divider></v-divider>
            <div style="color:#999;font-size:14px;line-height:30px;">详细信息</div>
            <v-card
             class="pa-5 ng-information"
             min-height="315"
             style="background-color:rgba(245, 247, 247, 1);color:#333;">
              <p>
                <span>问题站点:</span>
                <span v-if="stationinfolist.length > 0">
                  {{stationinfolist.find((stationinfo) => stationinfo.status === 0).name}}
                </span>
              </p>
              <p>
                <span>问题代码:</span>
                <span v-if="stationinfolist.length > 0">
                  {{stationinfolist.find((stationinfo) => stationinfo.status === 0).ngcode}}
                </span>
              </p>
              <p>
                <span>问题原因:</span>
                <span v-if="stationinfolist.length > 0">
                  {{stationinfolist.find((stationinfo) => stationinfo.status === 0).ngcode}}
                </span>
              </p>
            </v-card>
          </v-card>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-card
        style="background-color:rgba(245, 247, 247, 1);position:relative;"
        class="text-center"
        height="600px"
        >
          <div style="width:400px; margin:0 auto;position:relative;">
            <img src="../asset/production.svg" width="100%"/>
            <span
            :class="['production-part', packagerecord.point1 ? 'completed' : '']"
            style="top:43%;left:82%;"
            >1</span>
            <span
            :class="['production-part', packagerecord.point2 ? 'completed' : '']"
            style="top:60%;left:86%;"
            >2</span>
          </div>
          <div class="parts-status-group">
            <v-row class="px-10">
              <v-col>
                <div :class="['parts-status-group-item', packagerecord.point1 ? 'completed' : '']">
                  <p>工件1</p>
                  <p>已完成</p>
                </div>
              </v-col>
              <v-col>
                <div :class="['parts-status-group-item', packagerecord.point2 ? 'completed' : '']">
                  <p>工件2</p>
                  <p>请拿取</p>
                </div>
              </v-col>
            </v-row>
          </div>
          <!-- <v-btn
            x-large
            color="primary"
            class="mt-10"
            style="width:400px;"
            :loading="loading"
            :disabled="!isPrintAble"
            @click="handlePrint"
          >
            <v-icon>mdi-plus</v-icon>
            打印标签
          </v-btn>
          <v-btn
            x-large
            color="warning"
            class="mt-5"
            style="width:400px;"
            :disabled="!packagerecord.mainid"
            @click="scrapDialog=true"
          >
            <v-icon>mdi-delete-empty</v-icon>
            报废
          </v-btn> -->
        </v-card>
        <v-card>
          <v-row class="package-number mt-10" no-gutters>
            <v-col cols="2">
              <img src="../asset/pedding-bg.svg">
              <v-icon class="mt-3 ml-3" style="font-size:40px;">mdi-download</v-icon>
            </v-col>
            <v-col cols="4" class="text-center package-number-current">
              <p>{{packageLabelRecord.qty||0}}</p>
              <p>当前打包数</p>
            </v-col>
            <v-col cols="3" class="text-center package-number-total" @click="packageDialog=true">
              <p>{{totalNumber}}</p>
              <p>每箱总数<v-icon color="primary">mdi-pencil</v-icon> </p>
            </v-col>
             <v-col
              cols="3"
              class="text-center
              package-number-btn"
              color="primary"
              @click="getHistoryRecord"
              >
               <p class="mt-6">打包记录</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
    persistent
    scrollable
    v-model="packageDialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Total number
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="packageDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
        label="每箱总数"
        type="number"
        v-model="inputTotalNumber"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="handleChangeTotalNUmber"
          :loading="loading"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog
      persistent
      scrollable
      v-model="scrapDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title primary-title>
          <span>
            确认信息
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="scrapDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          确认报废吗?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="loading"
            @click="scrapPackage"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <package-record
     :packagerecorddialog = "packagerecorddialog"
     :packagehistoryrecord = "packagehistoryrecord"
      @setPackageRecordDialog="packagerecorddialog=false"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import socketioclient from 'socket.io-client';
import PackageRecord from '../components/PackageRecord';

export default {
  name: 'ParameterConfiguration',
  data() {
    return {
      packagerecordlist: [],
      mainid: '',
      barcode: '',
      mainidstatus: 0,
      detailMessege: '',
      packagerecord: {},
      loading: false,
      show: false,
      packageDialog: false,
      scrapDialog: false,
      totalNumber: null,
      inputTotalNumber: null,
      stationinfolist: [],
      isPrintAble: false,
      packageLabelRecord: {},
      labelrule: null,
      packagerecorddialog: false,
      packagehistoryrecord: [],
    };
  },
  components: {
    PackageRecord,
  },
  created() {
    this.init();
    this.initSoket();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('packagingManagement', ['getPackageRecord', 'getLabelRule', 'getPackageLabelRecord', 'updatePackageRecord', 'updateLabelRule', 'getSubstationList', 'getCheckout']),
    async handleChangeTotalNUmber() {
      if (this.inputTotalNumber > 0) {
        // this.totalNumber = this.inputTotalNumber;
        // this.packageDialog = false;
        const postData = {
          id: this.labelrule._id,
          payload: {
            maxnumber: this.inputTotalNumber,
          },
        };
        this.loading = true;
        const result = await this.updateLabelRule(postData);
        if (result) {
          this.totalNumber = this.inputTotalNumber;
          this.packageDialog = false;
          this.setAlert({
            show: true,
            type: 'success',
            message: '操作成功',
          });
          this.init();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: '操作失败',
          });
        }
        this.loading = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: '总数量必须大于0',
        });
      }
    },
    async init() {
      const [labelrule] = await this.getLabelRule();
      this.labelrule = labelrule;
      this.totalNumber = labelrule.maxnumber;
      const packagerecordlist = await this.getPackageRecord();
      const packagerecordlistinprogress = packagerecordlist
        .filter((packagerecord) => (packagerecord.status === 1) || (packagerecord.status === 2));
      if (packagerecordlistinprogress.length > 0) {
        this.mainid = packagerecordlistinprogress[0].mainid;
        this.barcode = packagerecordlistinprogress[0].barcode;
        [this.packagerecord] = packagerecordlistinprogress;
        this.mainidstatus = 1;
        this.getNGInfo(packagerecordlistinprogress[0].mainid);
        const packageLabelRecordList = await this.getPackageLabelRecord(`?query=barcode=="${this.barcode}"`);
        if (packageLabelRecordList.length > 0) {
          [this.packageLabelRecord] = packageLabelRecordList;
          if (Number(this.packageLabelRecord.qty) === Number(labelrule.maxnumber)) {
            this.isPrintAble = true;
          } else {
            this.isPrintAble = false;
          }
        }
      }
    },
    initSoket() {
      const socket = socketioclient.connect('192.168.8.113:10190');
      // let socket = socketioclient.connect(`${swxapi.serverip}:10190`);
      socket.on('connect', () => {
        console.log('socket connected successfully');
      });
      socket.on('update_package', async (data) => {
        if (data.mainid === this.mainid) {
          if (Number(data.status) === 3) {
            const result = await this.getPackageLabelRecord();
            if (result.length > 0) {
              const packageLabelRecord = result
                .filter((item) => item.barcode === this.packagerecord.barcode);
              if (packageLabelRecord.length > 0) {
                [this.packageLabelRecord] = packageLabelRecord;
                if (packageLabelRecord[0].status === 0) {
                  if (packageLabelRecord[0].qty === Number(this.totalNumber)) {
                    this.isPrintAble = true;
                  } else {
                    this.reset();
                  }
                } else {
                  this.setAlert({
                    show: true,
                    type: 'error',
                    message: '此条码已被打印',
                  });
                }
              }
            }
          } else {
            this.packagerecord = {
              ...data,
              point1: Number(data.point1),
              point2: Number(data.point2),
            };
          }
        }
      });
    },
    async getNGInfo(mainid) {
      let substationList = await this.getSubstationList();
      if (substationList.length) {
        substationList = substationList.map((item) => ({
          id: item.id,
          name: item.name,
          status: 0,
          ngcode: 0,
        })).reverse();
        substationList.forEach(async (substation) => {
          const checkInfo = await this.getCheckout(`?query=substationid==%22${substation.id}%22%26%26mainid==%22${mainid}%22&`
          + 'sortquery=createdTimestamp==-1&pagenumber=1&pagesize=1');
          if (checkInfo.length) {
            substation.status = checkInfo[0].substationresult;
            substation.ngcode = checkInfo[0].checkoutngcode;
          }
        });
      }
      this.stationinfolist = substationList;
    },
    async handlePackageRecord(mainid) {
      this.loading = true;
      const packagerecordlist = await this.getPackageRecord(`?query=mainid=="${mainid}"`);
      const packagerecordObj = packagerecordlist
        .find((item) => item.mainid === mainid);
      this.barcode = packagerecordObj.barcode;
      if (packagerecordObj) {
        if (packagerecordObj.status === 3) {
          this.mainidstatus = 2;
          this.detailMessege = '当前条码已包装完成';
        } else if (packagerecordObj.status === 4) {
          this.mainidstatus = 2;
          this.detailMessege = '当前条码已报废';
        } else if (packagerecordObj.status === 0) {
          const packagerecordlistnotstart = packagerecordlist
            .filter((packagerecord) => packagerecord.status === 0);
          const packagerecordfirst = packagerecordlistnotstart[
            packagerecordlistnotstart.length - 1
          ];
          if (
            packagerecordfirst.mainid === this.mainid
          ) {
            this.mainidstatus = 1;
            this.detailMessege = '';
            this.packagerecord = { ...packagerecordfirst };
            const postData = {
              id: packagerecordfirst._id,
              payload: {
                status: 1,
              },
            };
            await this.updatePackageRecord(postData);
          } else {
            this.mainidstatus = 2;
            this.detailMessege = '当前条码不是待包装首个条码';
          }
        }
      } else {
        this.mainidstatus = 2;
        this.detailMessege = '当前条码记录中不存在';
      }
      this.getNGInfo(mainid);
      this.loading = false;
    },
    async completePackage() {
      const postData = {
        id: this.packagerecord._id || this.packagerecord.id,
        payload: {
          status: 3,
        },
      };
      this.loading = true;
      const result = await this.updatePackageRecord(postData);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: '打包成功',
        });
        this.reset();
      }
      this.loading = false;
    },
    async scrapPackage() {
      const postData = {
        id: this.packagerecord._id || this.packagerecord.id,
        payload: {
          status: 4,
        },
      };
      this.loading = true;
      const result = await this.updatePackageRecord(postData);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: '报废成功',
        });
        this.reset();
      }
      this.loading = false;
    },
    async getHistoryRecord() {
      this.packagerecorddialog = true;
      const packagehistoryrecord = await this.getPackageRecord(`?query=barcode=="${this.barcode}"`);
      this.packagehistoryrecord = packagehistoryrecord;
    },
    handlePrint() {
      this.reset();
    },
    reset() {
      this.mainid = '';
      this.mainidstatus = 0;
      this.detailMessege = '';
      this.packagerecord = {};
      this.stationinfolist = [];
      this.scrapDialog = false;
      this.isPrintAble = false;
    },
  },
};
</script>
<style lang="scss" scoped>
  .wrong-code-title{
    font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 30px;
  }
  .wrong-code-subtitle{
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 15px;
    color: #767676;
  }
  .ng-station-title{
    font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    line-height: 40px;
    color: #555555;
  }
  .ng-information{
    p{
      span:nth-child(1){
        font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 15px;
        color: #767676;
        display: inline-block;
        width: 150px;
      }
    }
  }
  .v-stepper__header{
    justify-content: start;
    .v-stepper__step{
      padding: 0;
    }
  }
  .production-part{
    width: 50px;
    height: 50px;
    position: absolute;
    background-color: rgba(245, 247, 247, 1);
    border-radius: 50%;
    color: #555555;
    line-height: 50px;
  }
  .completed{
    background-color: rgba(55, 193, 2, 1)!important;
    p{
      color: #fff!important;
    }
  }
  .parts-status-group{
    position: absolute;
    width: 100%;
    height: 100px;
    top: 60%;
    .parts-status-group-item{
      border-radius: 16px;
      background-color: rgba(245, 247, 247, 1);
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.349019607843137);
      padding: 10px;
      p{
        margin: 0;
        color: #555555;
      }
      p:nth-child(1){
        font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 18px;
      }
    }
  }
  .package-number{
    height: 100px;
    background-color: rgba(245, 247, 247, 1);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    img{
      position: absolute;
      transform: rotate(90deg);
    }
    .package-number-current{
      p:nth-child(1){
        font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 40px;
        color: #555555;
        margin-bottom: 0;
      }
      p:nth-child(2){
        color: rgba(118, 118, 118, 0.698039215686274);
      }
    }
    .package-number-total{
      background-color: rgba(189, 195, 199, 1);
      cursor: pointer;
      p:nth-child(1){
        font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 40px;
        color: #fff;
        margin-bottom: 0;
      }
      p:nth-child(2){
        color: rgba(118, 118, 118, 0.698039215686274);
      }
    }
    .package-number-btn{
      background-color: rgba(53,68,147, 1);
      cursor: pointer;
      p{
        font-family: 'Poppins Bold', 'Poppins Regular', 'Poppins', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 30px;
        color: #fff;
        margin-bottom: 0;
      }
    }
    .package-number-total:hover{
      background-color: rgba(189, 195, 199, .5);
    }
    .package-number-btn:hover{
      background-color: rgba(53,68,147, .5);
    }
  }
</style>
