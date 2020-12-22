<template>
  <span>
    {{ date }}
  </span>
</template>

<script>
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
    date() {
      return formatDate(new Date(this.datetime), 'MMM d, HH:mm');
    },
  },
};
</script>
