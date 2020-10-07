<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-spacer></v-spacer>
          <v-btn small color="primary" class="text-none" @click="setAddPlanDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            Add order
          </v-btn>
          <v-btn
          small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn
          v-if="visible"
          small color="primary" outlined class="text-none ml-2" @click="MoveUp">
            Move Up
          </v-btn>
          <v-btn
          v-if="visible"
          small color="primary" outlined class="text-none ml-2" @click="MoveDown">
            Move Down
          </v-btn>
          <v-btn
          v-if="visible"
          small color="primary" outlined class="text-none ml-2" @click="MovetoButtom">
            Move to Bottom
          </v-btn>
          <v-btn
          v-if="visible"
          small color="primary" outlined class="text-none ml-2" @click="MovetoTop">
            Move to Top
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            Filters
          </v-btn>
        </v-toolbar>
        <v-data-table
        v-model="orders"
        :headers="headers"
        :items="orderList"
        :single-select="true"
        item-key="ordernumber"
        show-select
        >
        <template v-slot:item="{ item }">
          <tr :class="orderC(item.orderstatus)">
            <td>
               <v-checkbox
               v-model="orders"
               :value ="item"
               primary
               hide-details
               @change="check($event)"
               ></v-checkbox>
            </td>
            <td>{{ item.linename }}</td>
            <td @click="handleClick(item)">{{ item.ordername }}</td>
            <td>{{ item.ordernumber }}</td>
            <td>{{ item.ordertype }}</td>
            <td>{{ item.productname }}</td>
            <td>{{ item.customername }}</td>
            <td v-if='item.orderstatus == "New"'>
              <v-select
                dense
                flat
                solo
                hide-details
                :items="orderStatusToChangeFromNew"
                v-model="item.orderstatus"
                @change="onChangeStatus(item)"
              >
              <template v-slot:selection="{ item }">
                <span :class="orderC(item)">{{ item }}</span>
              </template></v-select></td>
            <td v-if='item.orderstatus == "Released"'>
              <v-select
                dense
                flat
                solo
                hide-details
                :items="orderStatusToChangeFromReleased"
                v-model="item.orderstatus"
                @change="onChangeStatus(item)"
            ><template v-slot:selection="{ item }">
                <span :class="orderC(item)">{{ item }}</span>
              </template></v-select></td>
            <td v-if='item.orderstatus == "Running"'><v-select
                dense
                flat
                solo
                hide-details
                :items="orderStatusToChangeFromRunning"
                v-model="item.orderstatus"
                @change="onChangeStatus(item)"
            ><template v-slot:selection="{ item }">
                <span :class="orderC(item)">{{ item }}</span>
              </template></v-select></td>
            <td v-if='item.orderstatus == "Interrupted"'><v-select
                dense
                flat
                solo
                hide-details
                :items="orderStatusToChangeFromInterrupted"
                v-model="item.orderstatus"
                @change="onChangeStatus(item)"
            ><template v-slot:selection="{ item }">
                <span :class="orderC(item)">{{ item }}</span>
              </template></v-select></td>
            <td v-if='item.orderstatus == "Completed"'>
              {{ item.orderstatus }}
            </td>
            <td><span>{{new Date(item.ordercreatedtime).toLocaleString()}}</span></td>
            <td><span>{{new Date(item.scheduledstart).toLocaleString()}}</span></td>
            <td><span>{{new Date(item.orderexpendtime).toLocaleString()}}</span></td>
            <td>{{ item.targetcount }}</td>
            <td>{{ item.actualcount }}</td>
            <td>{{ item.okcount }}</td>
            <td>{{ item.ngcount }}</td>
          </tr>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'OrderScheduleView',
  data() {
    return {
      drawer: true,
      orders: [],
      max25chars: 25,
      visible: false,
      orderStatusList: [
        {
          name: 'New',
        },
        {
          name: 'Released',
        },
        {
          name: 'Interrupted',
        },
        {
          name: 'Running',
        },
        {
          name: 'Completed',
        },
      ],
      orderStatusToChangeFromNew: ['New', 'Released', 'Interrupted'],
      orderStatusToChangeFromReleased: ['Released', 'Running', 'Interrupted', 'Completed'],
      orderStatusToChangeFromInterrupted: ['Interrupted', 'Running'],
      orderStatusToChangeFromRunning: ['Running', 'Interrupted', 'Completed'],
      headers: [
        {
          text: 'Line',
          value: 'line',
        },
        {
          text: 'Order Name',
          value: 'ordername',
        },
        {
          text: 'Order Number',
          value: 'ordernumber',
        },
        { text: 'Order Type', value: 'ordertype' },
        { text: 'Product Name', value: 'productname' },
        { text: 'Customer Name', value: 'customername' },
        { text: 'Order Status', value: 'orderstatus' },
        { text: 'Order Created Time', value: 'ordercreatedtime' },
        { text: 'Order Start Time', value: 'scheduledstart' },
        { text: 'Order Exp End Time', value: 'orderexpendtime' },
        { text: 'Target Count', value: 'targetcount' },
        { text: 'Actual Count', value: 'actualcount' },
        { text: 'Ok Count', value: 'okcount' },
        { text: 'NG Count', value: 'ngcount' },
      ],
    };
  },
  async created() {
    await this.getOrderListRecords('');
    this.orders = [];
  },
  computed: {
    ...mapState('orderManagement', ['orderList']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('orderManagement', ['setAddPlanDialog', 'toggleFilter']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    getClass(orderstatus) {
      if (orderstatus === 'New') {
        return 'orange';
      }
      if (orderstatus === 'Released') {
        return 'green';
      }
      return '';
    },
    ...mapActions('orderManagement', ['getOrderListRecords', 'updateOrder']),
    handleClick(value) {
      this.$router.push({ name: 'order-details', params: { id: value } });
    },
    async RefreshUI() {
      await this.getOrderListRecords('');
      this.orders = [];
    },
    check(event) {
      if (event.length > 0) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
    orderC(planstatus) {
      switch (planstatus) {
        case 'Running': return 'success--text';
        case 'Interrupted': return 'error--text';
        case 'New': return 'info--text';
        case 'Released': return 'warning--text';
        case 'Completed': return 'accent--text';
        default: return '';
      }
    },
    async MoveUp() {
      if (this.orders.length > 0) {
        if (this.orders[0].orderstatus === 'Released') {
          let resultObject = null;
          for (let i = 0; i < this.orderList.length; i += 1) {
            if (this.orders[0].ordername === this.orderList[i].ordername) {
              const j = i - 1;
              resultObject = this.orderList[j];
            }
          }
          if (resultObject.orderstatus === 'Released') {
            const object = {
              indexno: resultObject.indexno,
            };
            await this.updateOrder({ query: `?query=ordernumber=="${this.orders[0].ordernumber}"`, payload: object });
            const object2 = {
              indexno: this.orders[0].indexno,
            };
            await this.updateOrder({ query: `?query=ordernumber=="${resultObject.ordernumber}"`, payload: object2 });

            await this.getOrderListRecords('');
            this.orderList = this.orderList.sort((a, b) => a.indexno - b.indexno);
            this.setAlert({
              show: true,
              type: 'success',
              message: 'DATA_SAVED',
            });
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'NO_OTHER_RELEASED',
            });
          }
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ORDER_STATUS_ERROR',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_ORDER_FIRST',
        });
      }
    },
    async MoveDown() {
      if (this.orders.length > 0) {
        if (this.orders[0].orderstatus === 'Released') {
          let resultObject = null;
          for (let i = 0; i < this.orderList.length; i += 1) {
            if (this.orders[0].ordername === this.orderList[i].ordername) {
              const j = i + 1;
              resultObject = this.orderList[j];
            }
          }
          const object = {
            indexno: resultObject.indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${this.orders[0].ordernumber}"`, payload: object });
          const object2 = {
            indexno: this.orders[0].indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${resultObject.ordernumber}"`, payload: object2 });

          await this.getOrderListRecords('');
          this.orderList = this.orderList.sort((a, b) => a.indexno - b.indexno);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'DATA_SAVED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ORDER_STATUS_ERROR',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_ORDER_FIRST',
        });
      }
    },
    async MovetoButtom() {
      if (this.orders.length > 0) {
        if (this.orders[0].orderstatus === 'Released') {
          let resultObject = null;
          resultObject = this.orderList[this.orderList.length - 1];
          const object = {
            indexno: resultObject.indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${this.orders[0].ordernumber}"`, payload: object });
          const object2 = {
            indexno: this.orders[0].indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${resultObject.ordernumber}"`, payload: object2 });

          await this.getOrderListRecords('');
          this.orderList = this.orderList.sort((a, b) => a.indexno - b.indexno);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'DATA_SAVED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ORDER_STATUS_ERROR',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_ORDER_FIRST',
        });
      }
    },
    async MovetoTop() {
      if (this.orders.length > 0) {
        if (this.orders[0].orderstatus === 'Released') {
          const [resultObject] = this.orderList;
          const object = {
            indexno: resultObject.indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${this.orders[0].ordernumber}"`, payload: object });
          const object2 = {
            indexno: this.orders[0].indexno,
          };
          await this.updateOrder({ query: `?query=ordernumber=="${resultObject.ordernumber}"`, payload: object2 });

          await this.getOrderListRecords('');
          this.orderList = this.orderList.sort((a, b) => a.indexno - b.indexno);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'DATA_SAVED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ORDER_STATUS_ERROR',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_ORDER_FIRST',
        });
      }
    },
    async onChangeStatus(item) {
      let object;
      let statusFlag = 0;
      const test = this.orderList.filter((o) => o.orderstatus === 'Running');
      if (test.length > 1) {
        statusFlag = 1;
        await this.RefreshUI();
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALLREADY_ONE_RUNNING_STATUS',
        });
      } else
      if (item.orderstatus === 'Running') {
        statusFlag = 2;
        object = {
          orderstatus: item.orderstatus,
          orderruntime: new Date().getTime(),
        };
      } else if (item.orderstatus === 'Released') {
        statusFlag = 2;
        object = {
          orderstatus: item.orderstatus,
          orderreltime: new Date().getTime(),
        };
      } else if (item.orderstatus === 'Interrupted') {
        statusFlag = 2;
        object = {
          orderstatus: item.orderstatus,
          orderinttime: new Date().getTime(),
        };
      } else if (item.orderstatus === 'Completed') {
        statusFlag = 2;
        object = {
          orderstatus: item.orderstatus,
          ordercompletetime: new Date().getTime(),
        };
      } else {
        object = {
          orderstatus: item.orderstatus,
        };
      }
      if (statusFlag === 2) {
        const updated = await this.updateOrder({ query: `?query=ordernumber=="${item.ordernumber}"`, payload: object });
        if (updated) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'DATA_SAVED',
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
.card-border {
  border-left: 4px solid green;
}
.orange {
  text-emphasis-color: orange;
}
.green {
  background-color: green;
}
.v-data-table__wrapper{height:calc(100vh - 150px) !important;}
</style>
