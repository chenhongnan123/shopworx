<template>
  <div v-resize="setHeight">
    <v-btn
      small
      color="primary"
      class="text-none ml-4"
      @click="getLog"
      :disabled="fetchingLogs"
    >
      Refresh
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="downloadLogs"
      item-key="_id"
      fixed-header
      :height="height"
      :loading="fetchingLogs"
      :options.sync="options"
      :itemsPerPage="10"
      :footer-props="{
        disableItemsPerPage: true,
      }"
      :server-items-length="logCount"
    >
      <!-- eslint-disable-next-line -->
      <template #item.dateFrom="{ item }">
        <div>{{ getDateFrom(item.query) }}</div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.dateTo="{ item }">
        <div>{{ getDateTo(item.query) }}</div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.isEmailSent="{ item }">
        <div>{{ item.isEmailSent === false ? 'NO' : 'YES' }}</div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.link="{ item }">
        <a
          v-if="item.status === 'COMPLETED' || item.status === 'END'"
          :href="`${item.downloadPath}${item.filename}`"
          target="_blank"
        >
          Download
        </a>
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
      timeout: null,
      options: {},
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
      height: window.innerHeight,
    };
  },
  mounted() {
    this.setHeight();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  computed: {
    ...mapState('dataVisualizer', ['downloadLogs', 'fetchingLogs', 'logCount']),
  },
  methods: {
    ...mapActions('dataVisualizer', ['getDownloadLog']),
    setHeight() {
      this.height = window.innerHeight - 248;
    },
    async getLog() {
      const { page, itemsPerPage } = this.options;
      await this.getDownloadLog({
        pageSize: itemsPerPage,
        pageNumber: page,
      });
      this.timeout = setTimeout(() => {
        this.getLog();
      }, 120 * 1000);
    },
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
  watch: {
    options: {
      deep: true,
      handler() {
        this.getLog();
      },
    },
  },
};
</script>
