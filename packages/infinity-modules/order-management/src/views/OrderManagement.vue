<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>{{ $t('orderManagement') }}</span>
      <v-btn icon small class="ml-4 mb-1">
      </v-btn>
      <template>
        <v-menu
          bottom
          offset-y
          z-index="9999"
          transition="slide-y-transition"
        >
          <template #activator="{ on: menu }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  icon
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-icon
                    v-text="'$help'"
                  ></v-icon>
                </v-btn>
              </template>
              <span class="text-center">
                {{ $t('helper.orderstatus') }}
              </span>
            </v-tooltip>
          </template>
          <v-list dense>
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="mb-0 pb-0 text-uppercase"
                v-text="$t(`helper.${item.header}`)"
              ></v-subheader>
              <v-divider
                :key="index"
                class="pb-1"
                v-else-if="item.divider"
              ></v-divider>
              <v-list-item
                v-else
                :key="index"
              >
                <v-list-item-title v-if="item.color == 'success'" class="success--text"
                  v-text="$t(`help.${item.title}`)"
                ></v-list-item-title>
                <v-list-item-title v-else-if="item.color == 'info'" class="info--text"
                  v-text="$t(`help.${item.title}`)"
                ></v-list-item-title>
                <v-list-item-title v-else-if="item.color == 'warning'" class="warning--text"
                  v-text="$t(`help.${item.title}`)"
                ></v-list-item-title>
                <v-list-item-title v-else-if="item.color == 'error'" class="error--text"
                  v-text="$t(`help.${item.title}`)"
                ></v-list-item-title>
                <v-list-item-title v-else class="accent--text"
                  v-text="$t(`help.${item.title}`)"
                ></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal
      to="app-extension"
      v-if="onboarded && !loading"
    >
      <v-tabs
        dense
        center-active
        v-model="planView"
      >
        <v-tab class="text-none">
          {{ $t('Dashboard') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('Calendar') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('Order') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('Archive') }}
        </v-tab>
      </v-tabs>
    </portal>
    <order-filter></order-filter>
    <add-order />
    <order-loading v-if="loading" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <order-dashboard v-if="planView === 0" />
        <order-calendar-view v-else-if="planView === 1" />
        <order-schedule-view v-else-if="planView === 2" />
        <hidden-orders v-else-if="planView === 3" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import OrderLoading from './OrderLoading.vue';
import OrderDashboard from './OrderDashboard.vue';
import OrderScheduleView from './OrderScheduleView.vue';
import HiddenOrders from './HiddenOrders.vue';
import OrderCalendarView from './OrderCalendarView.vue';
import AddOrder from '../components/AddOrder.vue';
import OrderFilter from '../components/OrderFilter.vue';

export default {
  name: 'orderManagement',
  components: {
    OrderLoading,
    OrderDashboard,
    OrderScheduleView,
    OrderCalendarView,
    AddOrder,
    OrderFilter,
    HiddenOrders,
  },
  data() {
    return {
      planView: 0,
      loading: false,
      items: [
        {
          header: 'orderstatus',
        },
        {
          title: 'new',
          icon: '$keyboard',
          action: 'openKeyboardShortcuts',
          color: 'info',
        },
        {
          title: 'released',
          icon: '$support',
          action: 'openSupport',
          color: 'warning',
        },
        {
          title: 'running',
          icon: '$support',
          action: 'openSupport',
          color: 'success',
        },
        {
          title: 'interrupted',
          icon: '$support',
          action: 'openSupport',
          color: 'error',
        },
        {
          title: 'completed',
          icon: '$support',
          action: 'openSupport',
          color: 'accent',
        },
      ],
    };
  },
  computed: {
    ...mapState('orderManagement', ['onboarded']),
  },
  async created() {
    this.loading = true;
    const view = localStorage.getItem('planView');
    this.planView = view ? JSON.parse(view) : 0;
    this.setOnboarded(true);
    this.setExtendedHeader(true);
    this.loading = false;
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    planView(val) {
      localStorage.setItem('planView', val);
    },
  },
  methods: {
    ...mapMutations('orderManagement', ['setOnboarded']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
  },
};
</script>
