<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card v-if="!success">
      <v-card-title class="title font-weight-regular justify-space-between">
        Customer onboarded successfully!
      </v-card-title>
      <v-card-text>
        <div style="font-size:18px">
          Invite customer administrator to ShopWorx
        </div>
        <identifier-input
          id="identifier_input"
          :loading="loading"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <p>
          *This email/phone will be used to login to Infinity
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
          :disabled="!identifier"
          @click="invite"
        >
          Invite
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title class="title font-weight-regular justify-space-between">
        User Invited!
      </v-card-title>
      <v-card-text>
        <div style="font-size:18px">
          Customer on-boarding complete. Navigate back to Origin.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none"
          color="secondary"
          @click="exit"
        >
          Return to Origin
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'InviteAdmin',
  components: {
    IdentifierInput,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      prefix: '',
      identifier: '',
      isMobile: '',
      success: false,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('newCustomer', ['setCustomerData', 'setOnboardingSteps']),
    ...mapActions('user', ['inviteUsers', 'getRoles']),
    setIdentifier({ isMobile, prefix }) {
      this.isMobile = isMobile;
      this.prefix = prefix;
    },
    async invite() {
      this.loading = true;
      const identifier = this.isMobile
        ? `${this.prefix}${this.identifier}`
        : this.identifier;
      const roles = await this.getRoles();
      const { roleId } = roles.find((r) => r.roleName === 'admin');
      const addedUsers = await this.inviteUsers([{
        identifier,
        roleId,
      }]);
      if (addedUsers.every((user) => user.created)) {
        this.success = true;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INVITE_ERROR',
        });
      }
      this.loading = false;
    },
    exit() {
      const customerData = {
        1: {
          data: null,
          isComplete: false,
        },
        2: {
          data: null,
          isComplete: false,
        },
        3: {
          data: null,
          isComplete: false,
        },
      };
      const onboardingSteps = [{
        name: 'SMS settings',
        component: 'sms',
        isComplete: false,
        isLoading: false,
      }, {
        name: 'Web apps',
        component: 'apps',
        isComplete: false,
        isLoading: false,
      }, {
        name: 'Reports',
        component: 'reports',
        isComplete: false,
        isLoading: false,
      }, {
        name: 'Report views',
        component: 'report-views',
        isComplete: false,
        isLoading: false,
      }, {
        name: 'Insights',
        component: 'insight-views',
        isComplete: false,
        isLoading: false,
      }, {
        name: 'Roles & access',
        component: 'roles',
        isComplete: false,
        isLoading: false,
      }];
      this.setCustomerData(customerData);
      this.setOnboardingSteps(onboardingSteps);
      localStorage.removeItem('new-customer-data');
      localStorage.removeItem('onboarding-steps');
      this.$router.push({ name: 'customerAssets' });
    },
  },
};
</script>
