<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          打包记录
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 800px;">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Barcode
                </th>
                <th class="text-left">
                  Mainid
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in packagehistoryrecord"
                :key="item._id"
              >
                <td>{{ item.barcode }}</td>
                <td>{{ item.mainid }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="handlePrint"
        >
          重新打印
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: ['packagerecorddialog', 'packagehistoryrecord'],
  computed: {
    dialog: {
      get() {
        return this.packagerecorddialog;
      },
      set(val) {
        this.$emit('setPackageRecordDialog', val);
      },
    },
  },
  methods: {
    handlePrint() {
      this.$emit('handlePrint');
    },
  },
};
</script>
