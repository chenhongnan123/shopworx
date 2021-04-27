<template>
  <v-select
    dense
    outlined
    multiple
    return-object
    item-text="name"
    v-model="status"
    :items="statusList"
    :label="$t('planning.status')"
    prepend-inner-icon="mdi-list-status"
  >
    <template #selection="{ item, attrs, selected }">
      <v-chip
        :key="JSON.stringify(item)"
        v-bind="attrs"
        small
        :input-value="selected"
        :color="planStatus(item.value).color"
      >
        {{ $t(`planning.${item.value}`) }}
      </v-chip>
    </template>
  </v-select>
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
        name: 'Operational',
        value: 'inProgress',
      }, {
        name: 'New',
        value: 'notStarted',
      }, {
        name: 'Complete',
        value: 'complete',
      }, {
        name: 'Aborted',
        value: 'abort',
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['filters']),
    ...mapGetters('productionPlanning', ['planStatus']),
    isStatusFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    status: {
      get() {
        const statusFilter = this.filters && this.filters[FIELD_NAME];
        if (statusFilter) {
          const value = this.statusList.filter((s) => statusFilter.value.includes(s.value));
          if (value && value.length) {
            return value;
          }
        }
        return this.statusList;
      },
      set(statusVal) {
        this.setStatusFilter(statusVal);
      },
    },
  },
  created() {
    if (this.isStatusFilterInactive) {
      this.setStatusFilter(this.statusList);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    setStatusFilter(status) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: status.map((s) => s.value),
          operation: 'includes',
        },
      });
    },
  },
};
</script>
