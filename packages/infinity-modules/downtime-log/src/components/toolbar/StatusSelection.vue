<template>
  <v-combobox
    dense
    outlined
    return-object
    item-text="name"
    v-model="status"
    :items="statusList"
    label="Status"
    prepend-inner-icon="mdi-progress-check"
  ></v-combobox>
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
        name: 'All',
        value: 'All',
      }, {
        name: 'Ongoing',
        value: 'inProgress',
      }, {
        name: 'Completed',
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
