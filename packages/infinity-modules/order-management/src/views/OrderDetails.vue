<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Order Details</span>
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
    <v-btn icon @click="$router.push({ name: 'orderManagement' })">
    <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <span>Order number: </span>
    <span>{{id.ordernumber}}</span>
    <v-card flat class="transparent">
      <v-row>
        <v-col cols="12" md="6">
       <v-card :class="title === null ? 'mt-8' : ''">
        <v-card-text>
          <v-col>
            <span class="headline font-weight-regular success--text">Order Summary</span>
            <v-row no-gutters>
            <v-col cols="12" md="4" class="py-2">
              <div>
                Order name
              </div>
              <div class="title">
                {{ id.ordername }}
              </div>
              <div>
                Order type
              </div>
              <div class="title">
                {{ id.ordertype }}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <div>
                Order status
              </div>
              <div class="title">
                {{ id.orderstatus }}
              </div>
              <!-- <div>
                Target Count
              </div> -->
              <div class="title">
                <v-text-field
                 label="Target Count"
                 append-icon="mdi-pencil"
                 v-model="id.targetcount"
                 v-on:keyup.enter="updateTargetCount(id)"
                 hint="Hit Enter to Save"
                 type="number"
                ></v-text-field>
              </div>
            </v-col>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <v-row no-gutters>
            <span class="headline font-weight-regular info--text mt-2">Roadmap Summary</span>
            <v-col cols="12" class="py-2">
              <div>
                Roadmap name
              </div>
              <div class="title">
                {{ id.roadmapname }}
              </div>
              <div>
                Roadmap type
              </div>
              <div class="title" v-if="roadmapList">
                {{ roadmapList[0].roadmaptype }}
              </div>
              <div class="title" v-else>
                No Data
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col cols="12" class="py-2">
              <div class="title">
                Roadmap Details
              </div>
              <div>
                <v-data-table
                v-model="roadmaps"
                :headers="headersRoadmap"
                :items="roadmapDetails"
                :footer-props="{
                'items-per-page-options': [3, 10, 30, 40, 50]}"
                :items-per-page="3"
                height="200px">
              </v-data-table>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters v-if="id.orderstatus == 'Running'">
            <v-col cols="12" class="py-2">
              <div class="title">
                Running Order
              </div>
              <div>
                <v-data-table
                v-model="roadmaps"
                :headers="headersRunning"
                :items="subStationWiseOrderCount"
                :footer-props="{
                'items-per-page-options': [3, 10, 30, 40, 50]}"
                :items-per-page="3"
                height="200px">
              </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
    </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-card :class="title === null ? 'mt-8' : ''">
        <v-card-text>
          <v-col>
            <span class="headline font-weight-regular error--text mt-2">Product Summary</span>
            <v-row justify="left">
            <v-col cols="12" md="4" class="py-2">
              <div>
                Product name
              </div>
              <div class="title">
                {{ id.productname }}
              </div>
              <div>
                Customer name
              </div>
              <div class="title">
                {{ id.customername }}
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-2">
              <div>
                Product type
              </div>
              <div class="title">
                {{ id.producttype }}
              </div>
            </v-col>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <!-- <v-row no-gutters>
            <span class="headline font-weight-regular info--text mt-2">Recipe Summary</span>
            <v-col cols="12" class="py-2">
              <div>
                Recipe name
              </div>
              <div class="title">
                Recipe1
              </div>
              <div>
                Recipe version
              </div>
              <div class="title">
                2
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider> -->
          <v-row no-gutters>
            <v-col cols="12" class="py-2">
              <div class="title">
                Recipe Details
              </div>
              <v-data-table
                v-model="orders"
                :headers="headers"
                :items="productDetails"
                :footer-props="{
                'items-per-page-options': [3, 10, 30, 40, 50]}"
                :items-per-page="3"
                height="200px">
              </v-data-table>
            </v-col>
          </v-row>
           <v-divider></v-divider>
          <!-- <v-divider></v-divider>
          <v-row no-gutters>
            <span class="headline font-weight-regular info--text mt-2">Running Order Summary</span>
            <v-col cols="12" class="py-2">
              <div>
                Target Count
              </div>
              <div class="title">
                {{ id.targetcount }}
              </div>
              <div>
                Actual Count
              </div>
              <div class="title">
                {{ id.actualcount }}
              </div>
            </v-col>
          </v-row> -->
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

export default {
  name: 'OrderDetails',
  data() {
    return {
      showFlag: true,
      headers: [
        {
          text: 'Station Name',
          value: 'machinename',
        },
        {
          text: 'Sub-Station Name',
          value: 'substationname',
        },
        {
          text: 'Recipe Name',
          value: 'recipename',
        },
        { text: 'Recipe Version', value: 'recipeversion' },
      ],
      headersRunning: [
        {
          text: 'Station Name',
          value: 'substationname',
        },
        { text: 'OK Count', value: 'okcount' },
        { text: 'NG Count', value: 'ngcount' },
      ],
      runningOrders: [
        {
          stationname: 'ST20',
          actualcount: 0,
          okcount: 0,
          ngcount: 0,
          rework: 0,
        },
        {
          stationname: 'ST30',
          actualcount: 0,
          okcount: 0,
          ngcount: 0,
          rework: 0,
        },
      ],
      headersRoadmap: [
        {
          text: 'Substation Name',
          value: 'substationname',
        },
        {
          text: 'Process code',
          value: 'process',
        },
        { text: 'No. of Pre-Substation', value: 'amtpresubstation' },
        { text: 'Station name', value: 'machinename' },
        { text: 'Pre-SubStation name', value: 'presubstationname' },
        { text: 'Pre-Station name', value: 'prestationname' },
      ],
    };
  },
  async created() {
    await this.getRoadMap(`?query=name=="${this.id.roadmapname}"`);
    await this.getProductDetails(`?query=productname=="${this.id.productname}"`);
    // await this.getRunningOrder('');
    if (this.id.orderstatus === 'Running') {
      await this.getSubStationWiseOrderCounts({
        substationlist: this.productDetails,
        ordernumber: this.id.ordernumber,
      });
    }
  },
  computed: {
    ...mapState('orderManagement', ['roadmapList',
      'roadmapDetails',
      'productDetails',
      'runningOrderList',
      'subStationWiseOrderCount']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('orderManagement', ['getRoadMap',
      'getProductDetails',
      'updateOrder',
      'getRunningOrder',
      'getSubStationWiseOrderCounts']),
    async updateTargetCount(id) {
      if (id.orderstatus === 'Interrupted') {
        if (id.targetcount <= id.actualcount) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'TARGET_ACTUAL',
          });
        } else {
          const object = {
            targetcount: id.targetcount,
          };
          const updated = await this.updateOrder({ query: `?query=ordernumber=="${id.ordernumber}"`, payload: object });
          if (updated) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'DATA_SAVED',
            });
          }
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ORDER_NOT_INTERRUPTED',
        });
      }
    },
  },
  props: {
    id: {
      type: Object,
    },
  },
};
</script>

<style scoped>
table.v-table thead td, table.v-table thead th {
    height: 59px;
}
</style>
