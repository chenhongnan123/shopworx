<template>
  <v-responsive :max-width="350">
    <v-autocomplete
      dense
      filled
      clearable
      single-line
      hide-details
      return-object
      :loading="loading"
      :disabled="loading"
      :items="downtimeReasons"
      item-text="reasonname"
      item-value="reasonname"
      v-model="selectedReason"
    >
      <template #selection="data">
        {{ data.item.reasoncode }} | {{ data.item.reasonname }}
      </template>
      <template #item="data">
        <v-list-item-content>
          <v-list-item-title>
            {{ data.item.reasonname }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-text="data.item.reasoncode"
          ></v-list-item-subtitle>
          <v-list-item-subtitle
            v-text="data.item.category"
          ></v-list-item-subtitle>
          <v-list-item-subtitle
            v-text="data.item.department"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-responsive>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AssignDowntime',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeReasons']),
    selectedReason: {
      get() {
        return this.downtime.reasonname;
      },
      async set(val) {
        this.loading = true;
        let payload = {
          reasonname: '',
          reasoncode: '',
          category: '',
          department: '',
        };
        if (val) {
          const {
            reasonname,
            reasoncode,
            category,
            department,
          } = val;
          payload = {
            reasonname,
            reasoncode,
            category,
            department,
          };
        }
        await this.updateReason({
          // eslint-disable-next-line
          id: this.downtime._id,
          payload,
        });
        this.loading = false;
      },
    },
  },
  methods: {
    ...mapActions('downtimeLog', ['updateReason']),
  },
};
</script>
