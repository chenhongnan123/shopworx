<template>
  <div>
    <portal to="settings-header">
      <span>
        <add-holiday :holidays="holidays" @added="fetchRecords"/>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchRecords"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          {{ $t('admin.refresh') }}
        </v-btn>
      </span>
    </portal>
    <v-progress-circular
      indeterminate
      v-if="loading"
    ></v-progress-circular>
    <v-data-table
      item-key="id"
      class="transparent"
      :items="holidays"
      :headers="headers"
      disable-pagination
      hide-default-footer
      v-else
    >
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <v-btn
          icon
          @click="deleteHoliday(item)"
          :loading="deleting"
        >
          <v-icon v-text="'$delete'"></v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AddHoliday from './AddHoliday';

export default {
  name: 'BusinessHolidays',
  components: {
    AddHoliday,
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      loading: false,
      holidays: [],
      deleting: false,
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('element', ['getRecords', 'upsertBulkRecords', 'deleteRecordById']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businessholidays',
      });
      if (records && records.length) {
        this.holidays = records.map((rec) => ({
          id: rec._id,
          name: rec.name,
          date: rec.date,
        }));
      } else {
        this.holidays = [];
      }
      this.loading = false;
    },
    addHoliday() {
      this.holidays.push({
        name: '',
        date: '',
      });
    },
    removeHoliday(index) {
      this.holidays.splice(index, 1);
    },
    async deleteHoliday(item) {
      this.deleting = true;
      const payload = {
        elementName: 'businessholidays',
        id: item.id,
      };
      await this.deleteRecordById(payload);
      this.deleting = false;
      this.fetchRecords();
    },
  },
};
</script>
