<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <v-btn-toggle
        dense
        mandatory
        v-model="monthStart"
        color="primary"
      >
        <template v-for="(month, index) in months">
        <v-btn
          :key="index"
          class="text-none"
          v-text="$t(`onboarding.steps.calendar.months.${month}`)"
        ></v-btn>
        </template>
      </v-btn-toggle>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="saveMonthStart"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.reviewData.buttons.continue')"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'BusinessStartMonth',
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      monthStart: 0,
    };
  },
  methods: {
    saveMonthStart() {
      const [tag] = this.category.tags;
      console.log(tag);
      const payload = {
        ...this.category,
        record: {
          [tag.tagName]: this.monthStart,
        },
      };
      this.$emit('month-provisioned', payload);
    },
  },
};
</script>
