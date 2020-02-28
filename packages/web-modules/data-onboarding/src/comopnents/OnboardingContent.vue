<template>
  <v-card flat class="transparent">
    <base-onboarding
      v-if="!isCalendarType"
      :item="item"
    />
    <calendar-onboarding
      v-else
      :categories="categories"
    />
    <v-card-actions>
      <v-btn
        type="submit"
        @click="next"
        color="primary"
        class="text-none"
        v-text="$t('onboarding.next')"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      ></v-btn>
      <v-btn
        text
        @click="back"
        color="primary"
        v-if="step > 1"
        class="text-none"
        v-text="$t('onboarding.back')"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="skip"
        color="primary"
        class="text-none"
        v-if="isOptional"
        v-text="$t('onboarding.skip')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BaseOnboarding from './BaseOnboarding.vue';
import CalendarOnboarding from './CalendarOnboarding.vue';

export default {
  name: 'OnboardingContent',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseOnboarding,
    CalendarOnboarding,
  },
  computed: {
    ...mapState('onboarding', ['step']),
    isCalendarType() {
      return this.item && this.item.type === 'CALENDAR';
    },
    categories() {
      return this.item && this.item.categories ? this.item.categories : [];
    },
    isOptional() {
      return this.item && this.item.isOptional ? this.item.isOptional : false;
    },
    isComplete() {
      return this.item && this.item.isComplete ? this.item.isComplete : false;
    },
    isEditable() {
      return this.item && this.item.isEditable ? this.item.isEditable : false;
    },
  },
  methods: {
    ...mapMutations('onboarding', ['setStep']),
    next() {
      this.setStep(this.step + 1);
    },
    back() {
      this.setStep(this.step - 1);
    },
    skip() {
      this.setStep(this.step + 1);
    },
    complete() {
      console.log('complete');
    },
  },
};
</script>
