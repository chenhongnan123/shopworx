<template>
  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <v-toolbar
            flat
            dense
            :color="$vuetify.theme.dark ? '#121212': ''"
          >
            <v-spacer></v-spacer>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-toolbar>
        </div>
        <v-data-table
        :headers="headers"
        item-key="_id"
        :items="dataTypeList"
        show-select
        >
        </v-data-table>
      </div>
    </div>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';

export default {
  name: 'PlanScheduleView',
  data() {
    return {
      headers: [
        { text: 'PLC', value: 'plc' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Data type', value: 'name' },
        { text: 'Data type number', value: 'id' },
        { text: 'Size', value: 'size' },
        { text: 'isBigendian', value: 'isbigendian' },
        { text: 'isSwapped', value: 'isswapped' },
      ],
    };
  },
  async created() {
    await this.getDataTypes();
  },
  computed: {
    ...mapState('parameterConfiguration', ['dataTypeList']),
  },
  methods: {
    ...mapActions('parameterConfiguration', ['getDataTypes']),
    async RefreshUI() {
      await this.getDataTypes();
    },
  },
  components: {
  },
};
</script>
