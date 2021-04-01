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
    ></v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ExportLog',
  data() {
    return {
      headers: [
        { text: 'Requested at', value: 'createdTimestamp' },
        { text: 'Element name', value: 'elementName' },
        { text: 'Fields', value: 'fields' },
        { text: 'Query', value: 'query' },
        { text: 'Status', value: 'status' },
        { text: 'Email sent?', value: 'isEmailSent' },
        { text: 'Download link', value: 'link' },
      ],
    };
  },
  computed: {
    ...mapState('dataVisualizer', ['downloadLogs', 'fetchingLogs']),
  },
  methods: {
    ...mapActions('dataVisualizer', ['getDownloadLog']),
  },
};
</script>
