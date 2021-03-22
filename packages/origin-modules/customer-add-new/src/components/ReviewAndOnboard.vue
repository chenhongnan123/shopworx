<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <perfect-scrollbar ref="scroll">
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
        <v-card-text v-else-if="isMe">
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
              @on-complete="onComplete(n)"
              :loading="step.isLoading"
              :complete="step.isComplete"
            />
          </div>
          <div class="mt-4 mb-2">
            Please type in the customer name to confirm on-boarding (case-sensitive).
          </div>
          <v-text-field
            single-line
            v-model="customer"
            outlined
            :disabled="saving"
            :rules="requiredRule"
          ></v-text-field>
        </v-card-text>
        <v-card-text v-else>
          Provision customer, site and assets to view this section.
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            :disabled="!isValid || !isDataAvailable || !isConfirmed"
            :loading="saving"
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
import { mapState, mapMutations, mapActions } from 'vuex';
import Sms from './review/Sms.vue';
import Apps from './review/Apps.vue';
import Reports from './review/Reports.vue';
import ReportViews from './review/ReportViews.vue';
import InsightCategories from './review/InsightCategories.vue';
import InsightViews from './review/InsightViews.vue';
import Roles from './review/Roles.vue';

export default {
  name: 'ReviewAndOnboard',
  components: {
    Sms,
    Apps,
    Reports,
    ReportViews,
    InsightCategories,
    InsightViews,
    Roles,
  },
  data() {
    return {
      saving: false,
      loading: false,
      isValid: false,
      customer: '',
      isMe: false,
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  async created() {
    this.loading = true;
    let data = localStorage.getItem('onboarding-steps');
    data = JSON.parse(data);
    if (data) {
      const lastIndex = data.findIndex((step) => step.isLoading);
      if (lastIndex > -1) {
        data[lastIndex].isLoading = false;
      }
      this.setOnboardingSteps(data);
    }
    localStorage.setItem('onboarding-steps', JSON.stringify(this.onboardingSteps));
    this.isMe = await this.getMe();
    this.loading = false;
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
    ...mapMutations('newCustomer', [
      'updateOnboardingSteps',
      'updateCustomerData',
      'setOnboardingSteps',
    ]),
    ...mapActions('user', ['getMe']),
    onComplete(index) {
      const len = this.onboardingSteps.length;
      const step = this.onboardingSteps[index];
      this.updateOnboardingSteps({
        index,
        payload: {
          ...step,
          isLoading: false,
          isComplete: true,
        },
      });
      localStorage.setItem('onboarding-steps', JSON.stringify(this.onboardingSteps));
      if (len !== index + 1) {
        const nextStep = this.onboardingSteps[index + 1];
        this.updateOnboardingSteps({
          index: index + 1,
          payload: {
            ...nextStep,
            isLoading: true,
            isComplete: false,
          },
        });
        localStorage.setItem('onboarding-steps', JSON.stringify(this.onboardingSteps));
      } else {
        const data = {
          key: 3,
          data: this.onboardingSteps,
          isComplete: true,
        };
        this.updateCustomerData(data);
        localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
        this.saving = false;
        console.log('success');
        // show user dialog
      }
    },
    async save() {
      if (await this.$root.$confirm.open(
        'On-board customer',
        `This will take a while. Please do not refresh the page until complete.
        Click on 'agree' to confirm.`,
      )) {
        this.saving = true;
        let lastIndex = this.onboardingSteps.findIndex((step) => !step.isComplete);
        if (lastIndex < 0) {
          lastIndex = 0;
        }
        this.updateOnboardingSteps({
          index: lastIndex,
          payload: {
            ...this.onboardingSteps[lastIndex],
            isLoading: true,
          },
        });
        this.$refs.scroll.$el.scrollTop = 0;
      }
    },
  },
};
</script>
