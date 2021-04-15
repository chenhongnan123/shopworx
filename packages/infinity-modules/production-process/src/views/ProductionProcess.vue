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
          :items="substationList"
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
          :items="recordList"
          height="calc(100vh - 300px)"
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card style="background-color: rgb(245, 247, 247);" class="pa-3">
          <v-stepper>
              <v-stepper-header class="px-2">
                <v-stepper-step
                  step=""
                  complete
                  :rules="stationinfo.status === 2 ? [() => false] :  [() => true]"
                  v-for="(stationinfo, k) in stationinfolist"
                  :key="k"
                >
                </v-stepper-step>
              </v-stepper-header>
            </v-stepper>
            <v-toolbar-title
            class="ng-station-title"
            >
              站存在问题
            </v-toolbar-title>
            <v-divider></v-divider>
            <div style="color:#999;font-size:14px;line-height:30px;">详细信息</div>
            <v-card
             class="pa-5 ng-information"
             min-height="585"
             style="background-color:rgba(245, 247, 247, 1);color:#333;">
              <p>
                <span>查询结果:</span>
                <span>
                  {{}}
                </span>
              </p>
              <p>
                <span>问题站点:</span>
                <span>
                  {{}}
                </span>
              </p>
              <p>
                <span>问题代码:</span>
                <span>
                  {{}}
                </span>
              </p>
              <p>
                <span>问题原因:</span>
                <span>
                  {{}}
                </span>
              </p>
            </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'ParameterConfiguration',
  data() {
    return {
      substationList: [
        { name: 'OP40', id: 'op40' },
        { name: 'OP60', id: 'op60' },
      ],
      substationid: localStorage.getItem('substationid') || '',
      headers: [
        { text: '条码', value: 'mainid' },
        { text: '扫描时间', value: 'scantime' },
        { text: '状态', value: 'status' },
      ],
      recordList: [
        {
          mainid: '3243432ewrewr',
          scantime: '2021-03-18',
          status: 'ok',
        },
        {
          mainid: '3243432ewrewr',
          scantime: '2021-03-18',
          status: 'ok',
        },
      ],
      stationinfolist: [
        {
          id: 'id1',
          name: 'op01',
          status: 2,
          ngcode: 0,
        },
        {
          id: 'id1',
          name: 'op01',
          status: 2,
          ngcode: 0,
        },
        {
          id: 'id1',
          name: 'op01',
          status: 2,
          ngcode: 0,
        },
        {
          id: 'id1',
          name: 'op01',
          status: 2,
          ngcode: 0,
        },
      ],
    };
  },
  created() {
  },
  methods: {
    // ...mapMutations('helper', ['setAlert']),
    // ...mapActions('packagingManagement', []),
    handleChangeSubstation(id) {
      console.log(id, 'id');
      localStorage.setItem('substationid', id);
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
