<template>
  <div style="height:100%">
    <v-btn
      small
      color="primary"
      class="text-none ml-4"
      @click="getDownloadLog"
      :disabled="fetchingLogs"
    >
      Refresh
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="downloadLogs"
      item-key="_id"
      :loading="fetchingLogs"
    >
      <!-- eslint-disable-next-line -->
      <template #item.dateFrom="{ item }">
        <div>{{ getDateFrom(item.query) }}</div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.dateTo="{ item }">
        <div>{{ getDateTo(item.query) }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'ExportLog',
  data() {
    return {
      headers: [
        { text: 'Requested at', value: 'createdTimestamp' },
        { text: 'Requested by', value: 'createdBy' },
        { text: 'Element name', value: 'elementName' },
        { text: 'Fields', value: 'fields' },
        { text: 'Date from', value: 'dateFrom' },
        { text: 'Date to', value: 'dateTo' },
        { text: 'Status', value: 'status' },
        { text: 'Email sent?', value: 'isEmailSent' },
        { text: 'Download link', value: 'link' },
      ],
    };
  },
  created() {
    this.getDownloadLog();
  },
  computed: {
    ...mapState('dataVisualizer', ['downloadLogs', 'fetchingLogs']),
  },
  methods: {
    ...mapActions('dataVisualizer', ['getDownloadLog']),
    parseDateRange(query) {
      const condition = JSON.parse(query);
      return condition.$and[1].createdTimestamp;
    },
    getDateFrom(query) {
      const timestamps = this.parseDateRange(query);
      return formatDate(new Date(timestamps.$gte.$date), 'yyyy-MM-dd HH:mm:ss');
    },
    getDateTo(query) {
      const timestamps = this.parseDateRange(query);
      return formatDate(new Date(timestamps.$lte.$date), 'yyyy-MM-dd HH:mm:ss');
    },
  },
};
</script>
