<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <perfect-scrollbar>
      <v-card
        flat
        class="transparent"
        fill-height
        style="max-height: calc(100vh - 104px);"
      >
        <v-progress-linear
          v-if="loading"
          :indeterminate="true"
        ></v-progress-linear>
        <v-card-text>
          <div
            v-for="(step, n) in onboardingSteps"
            :key="n"
            class="mb-2"
          >
            <v-progress-circular
              size="20"
              width="2"
              class="mr-1"
              indeterminate
              v-if="step.isLoading"
            ></v-progress-circular>
            <v-icon
              v-else-if="step.isComplete"
              color="success"
            >
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else>
              mdi-checkbox-marked-circle
            </v-icon>
            <span class="font-weight-medium primary--text">
              {{ step.name }}
            </span>
            <component
              :is="step.component"
            />
          </div>
          <div class="mt-4 mb-2">
            Please type in the customer name to confirm on-boarding (case-sensitive).
          </div>
          <v-text-field
            single-line
            v-model="customer"
            outlined
            :rules="requiredRule"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            :disabled="!isValid || !isDataAvailable || !isConfirmed"
            color="primary"
            type="submit"
          >
            On-board customer
          </v-btn>
        </v-card-actions>
      </v-card>
    </perfect-scrollbar>
  </v-form>
</template>

<script>
import { mapState } from 'vuex';
import Customer from './review/Customer.vue';
import Site from './review/Site.vue';
import Sms from './review/Sms.vue';
import Assets from './review/Assets.vue';
import Apps from './review/Apps.vue';
import Reports from './review/Reports.vue';
import ReportViews from './review/ReportViews.vue';
import InsightCategories from './review/InsightCategories.vue';
import InsightViews from './review/InsightViews.vue';
import Roles from './review/Roles.vue';

export default {
  name: 'ReviewAndOnboard',
  components: {
    Customer,
    Site,
    Sms,
    Assets,
    Apps,
    Reports,
    ReportViews,
    InsightCategories,
    InsightViews,
    Roles,
  },
  data() {
    return {
      loading: false,
      isValid: false,
      customer: '',
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('newCustomer', ['onboardingSteps', 'customerData']),
    isDataAvailable() {
      const completedStepsLength = Object.keys(this.customerData)
        .filter((c) => this.customerData[c].isComplete)
        .length;
      return completedStepsLength === 2;
    },
    isConfirmed() {
      const customerName = this.customerData['1'].data && this.customerData['1'].data.customerPayload.customerDescription;
      return customerName === this.customer;
    },
  },
  methods: {
    async save() {
      console.log('hi');
    },
  },
};
</script>
