<template>
  <v-container>
    <v-row>
      <v-col sm="4" md="4" lg="3" xl="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <template v-for="(item, index) in items">
              <v-divider
                :key="index"
                class="my-2"
                v-if="item.divider"
              ></v-divider>
              <v-list-item
                link
                v-else
                :key="index"
                color="primary"
                :to="{ params: { id: item.step } }"
              >
                <v-list-item-icon>
                  <v-icon
                    v-if="!customerData[item.step].isComplete"
                  >
                    {{ item.icon }}
                  </v-icon>
                  <v-icon
                    v-else
                    color="success"
                  >
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet
          height="calc(100vh - 104px)"
          rounded="lg"
        >
          <component
            :is="selectedComponent"
            :info="currentInfoObject"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import CustomerAndSites from '../components/CustomerAndSites.vue';
import AssetsAndLicense from '../components/AssetsAndLicense.vue';
import RolesAndAccess from '../components/RolesAndAccess.vue';
import ReviewAndOnboard from '../components/ReviewAndOnboard.vue';

export default {
  name: 'CustomerContainer',
  components: {
    CustomerAndSites,
    AssetsAndLicense,
    RolesAndAccess,
    ReviewAndOnboard,
  },
  data() {
    return {
      items: [{
        name: 'Customer & sites',
        icon: 'mdi-account-star-outline',
        step: '1',
      }, {
        name: 'Assets & license',
        icon: 'mdi-license',
        step: '2',
      }, {
        name: 'Roles & access',
        icon: 'mdi-shield-star-outline',
        step: '3',
      }, {
        divider: true,
      }, {
        name: 'Review & on-board',
        icon: 'mdi-file-settings-outline',
        step: '4',
      }],
    };
  },
  created() {
    // check for complete steps
    const data = localStorage.getItem('new-customer-data');
    if (data) {
      this.setCustomerData(JSON.parse(data));
    } else {
      localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
    }
    // Redirect based on completed steps
    this.redirect();
  },
  computed: {
    ...mapState('newCustomer', ['customerData']),
    id() {
      return this.$route.params.id;
    },
    selectedComponent() {
      let component = '';
      const step = parseInt(this.id, 10);
      if (step === 1) {
        component = 'customer-and-sites';
      } else if (step === 2) {
        component = 'assets-and-license';
      } else if (step === 3) {
        component = 'roles-and-access';
      } else if (step === 4) {
        component = 'review-and-onboard';
      }
      return component;
    },
    currentInfoObject() {
      return this.customerData[this.id];
    },
  },
  methods: {
    ...mapMutations('newCustomer', [
      'setCustomerData',
    ]),
    redirect() {
      this.routes = this.items.filter((item) => item.step);
      const to = this.routes.map((item) => item.step);
      if (this.id === undefined) {
        this.$router.push({ params: { id: 1 } });
      } else if (this.id) {
        const validId = to.includes(this.id);
        if (!validId) {
          this.$router.push({ params: { id: 1 } });
        }
      }
    },
  },
};
</script>
