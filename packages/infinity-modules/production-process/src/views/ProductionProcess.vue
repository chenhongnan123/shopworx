<template>
  <div class="pa-5">
    <portal to="app-header">
      查询界面
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
    <v-row>
      <v-col cols="2" class="text-h5" style="line-height:50px;">选择工站:</v-col>
      <v-col cols="3">
        <v-select
          :disabled="!!substationid"
          :items="substationlist"
          v-model="substationid"
          label="选择工站"
          item-text="name"
          item-value="id"
          solo
          hide-details
          @change="handleChangeSubstation"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card style="background-color: rgb(245, 247, 247);" class="pa-3">
          <v-data-table
          :headers="headers"
          :items="recordlist"
          hide-default-footer
          height="calc(100vh - 200px)"
          >
          <template #item.status="props">
          <!-- {{props.item.status}} -->
          <v-icon v-if="props.item.status" color="success">mdi-check-bold</v-icon>
          <v-icon v-else color="error">mdi-close-thick</v-icon>
        </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card style="background-color: rgb(245, 247, 247);" class="pa-3">
          <v-stepper>
              <v-stepper-header class="px-2">
                <!-- <v-stepper-step
                  step=""
                  :rules="[() => false]"
                >
                </v-stepper-step> -->
                <v-stepper-step
                  step=""
                  :complete="stationinfo.status === 1"
                  :rules="stationinfo.status ? [() => true] :  [() => false]"
                  v-for="(stationinfo, k) in stationinfolist"
                  :key="k"
                >
                </v-stepper-step>
              </v-stepper-header>
            </v-stepper>
            <v-toolbar-title
            class="ng-station-title"
            >
            {{ngstation||'-'}}站存在问题
            </v-toolbar-title>
            <v-divider></v-divider>
            <div style="color:#999;font-size:14px;line-height:30px;">详细信息</div>
            <v-card
             class="pa-5 ng-information"
             min-height="410"
             style="background-color:rgba(245, 247, 247, 1);color:#333;">
              <p>
                <span>查询结果:</span>
                <span>
                  {{ngstation ? '产品NG' : (stationinfolist.length > 0 ? '产品OK' : '')}}
                </span>
              </p>
              <p>
                <span>问题站点:</span>
                <span>
                  {{ngstation||''}}
                </span>
              </p>
              <p>
                <span>问题代码:</span>
                <span>
                  {{ngcode}}
                </span>
              </p>
              <p>
                <span>问题原因:</span>
                <span>
                  {{ngreason}}
                </span>
              </p>
            </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import socketioclient from 'socket.io-client';
// import moment from 'moment';
export default {
  name: 'ParameterConfiguration',
  data() {
    return {
      substationlist: [
        { name: 'OP80-1', id: 'OP80-1' },
        { name: 'OP110', id: 'OP110' },
      ],
      substationlistall: [],
      substationid: localStorage.getItem('substationid') || '',
      headers: [
        { text: '条码', value: 'mainid' },
        { text: '扫描时间', value: 'scantime' },
        { text: '状态', value: 'status' },
      ],
      recordlist: localStorage.getItem('processrecord') ? JSON.parse(localStorage.getItem('processrecord')) : [],
      stationinfolist: [],
      ngstation: '',
      ngcode: '',
      ngreason: '',
      ngreasonlist: [
        '本站可做',
        'NG件',
        '配方不正确',
        '产品类型不正确',
        '物料不正确',
        '本站已完成(放行)',
        '已完成件',
        '没有订单',
        '订单不匹配',
        '订单数量已满',
        '本站已有NG记录',
        '此托盘未绑定产品',
        '本站不是目标站',
      ],
    };
  },
  async created() {
    const substationlistall = await this.getSubstationList();
    let op801k = 0;
    substationlistall.forEach((item, k) => {
      if (item.name === 'OP80-1') {
        op801k = k;
      }
    });
    substationlistall.splice(op801k, 1);
    this.substationlistall = substationlistall.reverse();
    if (this.substationid) {
      if (this.substationid === 'OP80-1') {
        this.initSoket('update_checkin');
      } else {
        this.initSoket('update_autocheck');
      }
    }
  },
  methods: {
    // ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionProcess', ['getPartStatus', 'getSubstationList', 'getCheckin', 'getCheckout', 'getNgConfig']),
    async handleChangeSubstation(id) {
      console.log(id, 'id');
      localStorage.setItem('substationid', id);
      if (id === 'OP80-1') {
        this.initSoket('update_checkin');
      } else {
        this.initSoket('update_autocheck');
      }
    },
    initSoket(socketelement) {
      // const socket = socketioclient.connect('192.168.8.158:10190');
      const socket = socketioclient.connect(`${window.location.host}:10190`);
      socket.on('connect', () => {
        console.log('socket connected successfully');
      });
      socket.on(socketelement, async (data) => {
        console.log(data, 'data');
        this.ngcode = '';
        this.ngreason = '';
        this.ngstation = '';
        this.stationinfolist = [];
        const {
          substationlistall,
          recordlist,
          substationid,
          ngreasonlist,
        } = this;
        if (data.substationname === substationid) {
          const partStatuslist = await this.getPartStatus(`?query=mainid=="${data.mainid}"`);
          if (partStatuslist.length > 0) {
            const [currentpartstatus] = partStatuslist;
            recordlist.unshift({
              mainid: currentpartstatus.mainid,
              scantime: currentpartstatus.createdTimestamp,
              status: currentpartstatus.overallresult === 2 ? 0 : 1,
            });
            if (recordlist.length > 10) {
              recordlist.pop();
            }
            this.recordlist = recordlist;
            localStorage.setItem('processrecord', JSON.stringify(recordlist));
            let currentkey = 0;
            substationlistall.forEach(async (item, k) => {
              if (item.name === currentpartstatus.substationname) {
                currentkey = k;
              }
            });
            if (currentpartstatus.overallresult === 2) {
              const stationinfolist = substationlistall.map((item, k) => {
                const obj = {
                  id: item.id,
                  name: item.name,
                  status: 0,
                };
                if (currentkey > k) {
                  obj.status = 1;
                } else if (currentkey < k) {
                  obj.status = 2;
                }
                return obj;
              });
              this.stationinfolist = stationinfolist;
              this.ngstation = currentpartstatus.substationname;
              const checkoutlist = await this.getCheckout(`?query=substationname=="${substationlistall[currentkey].name}"%26%26mainid=="${data.mainid}"`);
              console.log(checkoutlist, 'checkoutlist');
              if (checkoutlist.length > 0) {
                const ngcode = checkoutlist[0].checkoutngcode;
                const ngConfigList = await this.getNgConfig();
                const ngreason = ngConfigList.find((item) => item.ngcode === ngcode).ngdescription;
                this.ngcode = ngcode;
                this.ngreason = ngreason;
              }
              // console.log(stationinfolist, 'stationinfolist');
            } else {
              const stationinfolist = substationlistall.map((item, k) => {
                const obj = {
                  id: item.id,
                  name: item.name,
                  status: 1,
                };
                if (currentkey < k) {
                  obj.status = 2;
                }
                return obj;
              });
              this.stationinfolist = stationinfolist;
            }
          } else {
            const stationinfolist = substationlistall.map((item) => {
              const obj = {
                id: item.id,
                name: item.name,
                status: 0,
              };
              return obj;
            });
            this.stationinfolist = stationinfolist;
            this.ngstation = substationid;
            const checkinlist = await this.getCheckin(`?query=substationname=="${substationid}"%26%26mainid=="${data.mainid}"`);
            console.log(checkinlist, 'checkinlist');
            if (checkinlist.length > 0) {
              const ngcode = checkinlist[0].checkinresult;
              let ngreason = '';
              if (ngcode === -1) {
                ngreason = '保存数据缺失';
              } else {
                ngreason = ngreasonlist[ngcode - 1];
              }
              this.ngcode = ngcode;
              this.ngreason = ngreason;
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
