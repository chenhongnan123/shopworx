<template>
  <v-stepper-step
    :complete="checkIsComplete(item)"
    :editable="checkIsEditable(item)"
    :step="item.step"
    class="text-none"
  >
    <span v-text="$t(`onboarding.steps.${item.title}.title`)"></span>
    <small
      v-if="checkIsOptional(item)"
      v-text="$t('onboarding.optional')"
    ></small>
  </v-stepper-step>
</template>

<script>
export default {
  name: 'OnboardingStep',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    checkIsOptional(item) {
      return item && item.isOptional ? item.isOptional : false;
    },
    checkIsComplete(item) {
      return item && item.isComplete ? item.isComplete : false;
    },
    checkIsEditable(item) {
      return item && item.isEditable ? item.isEditable : false;
    },
  },
};
</script>
