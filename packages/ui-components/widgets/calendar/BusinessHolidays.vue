<template>
  <v-card
    height="100%"
    rounded="lg"
  >
    <v-card-title>
      Business holidays
      <v-spacer></v-spacer>
      <add-holiday @on-register="fetchRecords" />
    </v-card-title>
    <v-card-text>
      <v-data-table
        item-key="_id"
        class="transparent"
        disable-pagination
        :items="holidays"
        :loading="loading"
        hide-default-footer
        :headers="headers"
      >
        <template #no-data>
          No business holidays
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import AddHoliday from './AddHoliday.vue';

export default {
  name: 'BusinessHolidays',
  components: {
    AddHoliday,
  },
  data() {
    return {
      loading: false,
      holidays: [],
      headers: [
        {
          text: 'Date',
          align: 'start',
          value: 'date',
        },
        {
          text: 'Name',
          align: 'start',
          value: 'name',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('element', ['getRecords']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businessholidays',
      });
      if (records && records.length) {
        this.holidays = records.map((rec) => ({
          name: rec.name,
          date: rec.date,
        }));
      }
      this.loading = false;
    },
  },
};
</script>
