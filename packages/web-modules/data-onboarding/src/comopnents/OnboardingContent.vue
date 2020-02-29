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
    skip() {
      this.setStep(this.step + 1);
    },
  },
};
</script>
