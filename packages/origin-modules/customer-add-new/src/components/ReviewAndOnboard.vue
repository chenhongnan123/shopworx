<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <v-card flat class="transparent" fill-height>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <perfect-scrollbar>
        <v-card-text style="max-height: calc(100vh - 156px);">
          <div
            v-for="(step, n) in onboardingSteps"
            :key="n"
          >
            <span class="font-weight-medium">
              {{ step.name }}
            </span>
          </div>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          block
          :disabled="!isValid"
          color="primary"
          type="submit"
        >
          On-board customer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ReviewAndOnboard',
  data() {
    return {
      loading: false,
      isValid: false,
    };
  },
  computed: {
    ...mapState('newCustomer', ['onboardingSteps']),
  },
  methods: {
    async save() {
      if (await this.$root.$confirm.open(
        'On-board customer',
        `This will take a while. Please do not refresh the page until success message.
        Click on 'agree' to confirm.`,
      )) {
        console.log('hi');
      }
    },
  },
};
</script>
