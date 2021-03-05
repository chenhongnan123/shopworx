<template>
  <v-menu
    bottom
    offset-y
  >
    <template #activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        <v-icon small left>mdi-cloud-download-outline</v-icon>
        Export
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(type, n) in exportTypes"
        @click="exportReport(type)"
      >
        <v-list-item-title>
          <v-icon small left>{{ type.icon }}</v-icon>
          <span>{{ type.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'ExportReports',
  data() {
    return {
      exportTypes: [
        {
          name: 'CSV',
          value: 'gridCSV',
          icon: 'mdi-file-delimited-outline',
        },
        {
          name: 'Excel',
          value: 'gridExcel',
          icon: 'mdi-file-excel-outline',
        },
      ],
    };
  },
  methods: {
    exportReport(type) {
      this.$emit('on-export', type.value);
    },
  },
};
</script>
