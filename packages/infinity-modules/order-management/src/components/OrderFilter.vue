<template>
  <v-navigation-drawer
    absolute
    right
    :overlay-opacity="0"
    temporary
    v-model="showFilter"
  >
    <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'"
    >
      <v-toolbar-title>
        {{ $t('Order filters') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <v-autocomplete
            :items="orderList"
            outlined
            dense
            hide-details
            v-model="selectedOrderName"
            name="ordername"
            return-object
            :label="$t('Order Name')"
            item-text="ordername"
            @change="onOrderNameSelection()"
          >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.ordername"></v-list-item-title>
            </v-list-item-content>
          </template>
          </v-autocomplete>
          <div class="subheading font-weight-regular mt-4">
            {{ $t('Order status') }}
          </div>
          <v-chip-group
            v-model="orderStatusSelected"
            column
            single
            mandatory
          >
            <v-chip outlined active-class="info--text">{{ $t('New') }}</v-chip>
            <v-chip outlined active-class="warning--text">{{ $t('Released') }}</v-chip>
            <v-chip outlined active-class="success--text">{{ $t('Running') }}</v-chip>
            <v-chip outlined active-class="error--text">{{ $t('Interrupted') }}</v-chip>
            <v-chip outlined active-class="accent--text">{{ $t('Completed') }}</v-chip>
          </v-chip-group>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          Apply
        </v-btn>
        <v-btn
         class="text-none"
         color="primary"
         @click="btnReset"
         text>
         Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'OrderFilter',
  created() {
  },
  data() {
    return {
      orderStatusSelected: null,
      selectedOrderName: null,
      flag: false,
    };
  },
  computed: {
    ...mapState('orderManagement', ['filter', 'orderList', 'archiveValue']),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  methods: {
    ...mapMutations('orderManagement', ['setFilter', 'toggleFilter']),
    ...mapActions('orderManagement', ['getOrderListRecords']),
    btnApply() {
      if (this.flag) {
        this.getOrderListRecords(`?query=ordernumber=="${this.selectedOrderName.ordernumber}"`);
      } else {
        this.getOrderListRecords(`?query=orderstatus=="${this.orderStatusText(this.orderStatusSelected)}"`);
      }
      this.toggleFilter();
    },
    btnReset() {
      this.orderStatusSelected = null;
      this.selectedOrderName = null;
      if (this.archiveValue) {
        this.getOrderListRecords('?query=visible==true');
      } else {
        this.getOrderListRecords('?query=visible==false');
      }
      this.toggleFilter();
    },
    orderStatusText(orderstatusnumber) {
      switch (orderstatusnumber) {
        case 0: return 'New';
        case 1: return 'Released';
        case 2: return 'Running';
        case 3: return 'Interrupted';
        case 4: return 'Completed';
        default: return '';
      }
    },
    onOrderNameSelection() {
      this.flag = true;
    },
  },
};
</script>
