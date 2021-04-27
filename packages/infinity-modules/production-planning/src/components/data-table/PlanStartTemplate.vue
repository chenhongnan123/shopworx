<template>
  <span>
    {{ date }}
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanStartTemplate',
  props: {
    datetime: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
    date() {
      return formatDate(
        new Date(this.datetime),
        'MMM d, HH:mm',
        { locale: this.locale },
      );
    },
  },
};
</script>
