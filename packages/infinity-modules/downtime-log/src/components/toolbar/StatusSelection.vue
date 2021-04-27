<template>
  <v-select
    dense
    outlined
    return-object
    item-text="name"
    v-model="status"
    :items="statusList"
    :label="$t('downtime.status')"
    prepend-inner-icon="mdi-progress-check"
  ></v-select>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

const FIELD_NAME = 'status';

export default {
  name: 'StatusSelection',
  data() {
    return {
      statusList: [{
        name: this.$t('downtime.all'),
        value: 'All',
      }, {
        name: this.$t('downtime.ongoing'),
        value: 'inProgress',
      }, {
        name: this.$t('downtime.completed'),
        value: 'complete',
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['filters']),
    isStatusFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    status: {
      get() {
        const statusFilter = this.filters && this.filters[FIELD_NAME];
        if (statusFilter) {
          const value = this.statusList.find((s) => s.value === statusFilter.value);
          if (value) {
            return value;
          }
        }
        return this.statusList[0];
      },
      set(statusVal) {
        this.setStatusFilter(statusVal);
      },
    },
  },
  created() {
    if (this.isStatusFilterInactive) {
      this.setStatusFilter(this.statusList[0]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setStatusFilter(status) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: status.value,
          operation: 'eq',
        },
      });
    },
  },
};
</script>
