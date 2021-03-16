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
              @on-complete="onComplete(n)"
              :loading="step.isLoading"
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
import { mapState, mapMutations } from 'vuex';
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
      saving: false,
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
    ...mapMutations('newCustomer', ['updateOnboardingSteps']),
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
      } else {
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
        this.updateOnboardingSteps({
          index: 0,
          payload: {
            ...this.onboardingSteps[0],
            isLoading: true,
          },
        });
        this.$refs.scroll.$el.scrollTop = 0;
      }
    },
  },
};
</script>
