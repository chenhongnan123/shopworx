<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
        <v-col cols="12" xl="10" class="py-0">
             <v-toolbar
              flat
              dense
              lass="stick"
              :color="$vuetify.theme.dark ? '#121212': ''"
              >
            <v-spacer></v-spacer>
            <v-text-field
            class="mt-10 mr-2"
            type="datetime-local"
            v-model="fromdate"
            label="From date"
            dense
            ></v-text-field>
            <v-text-field
            class="mt-10 mr-2"
            type="datetime-local"
            v-model="todate"
            label="To date"
            dense
            ></v-text-field>
            <v-btn small
            color="primary"
            outlined
            class="text-none ml-2"
            @click="btnSearch">
            {{ $t('displayTags.buttons.btnSearch') }}
          </v-btn>
              <v-btn small color="primary" outlined class="text-none ml-2" @click="refreshUi">
            {{ $t('displayTags.buttons.btnRefresh') }}
            </v-btn>
            </v-toolbar>
        </v-col>
      </v-row>
        <v-data-table
        class="mt-2"
        v-model="reworkTable"
        :headers="headers"
        :items="reworkList"
        item-key="_id"
        >
        <template v-slot:item="{ item, index }">
          <tr>
          <td>{{ index+1 }}</td>
          <td>{{ item.createdTimestamp }}</td>
          <td>{{ item.mainid }}</td>
          <td>{{ item.checkoutngcode }}</td>
          <td v-if="ngCodeDetails.filter((f) =>
            f.ngcode === item.checkoutngcode).length > 0">{{ ngCodeDetails.filter((f) =>
            f.ngcode === item.checkoutngcode)[0].ngdescription }}</td>
          <td v-else></td>
          <td>{{ item.ordername }}</td>
          <td>{{ item.substationmatch }}</td>
          </tr>
        </template>
      </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'NgCodeConfig',
  data() {
    return {
      headers: [
        {
          text: 'No.',
          value: 'number',
        },
        {
          text: 'Date',
          value: 'createdTimestamp',
        },
        {
          text: 'Main ID',
          value: 'mainid',
        },
        { text: 'NG Code', value: 'checkoutngcode' },
        { text: 'NG Description', value: 'ngcodematch' },
        {
          text: 'Order name',
          value: 'ordername',
        },
        {
          text: 'Sub-Station',
          value: 'substationmatch',
        },
      ],
      visible: false,
      dialog: false,
      dialogDup: false,
      dialogConfirm: false,
      dupRecipeName: null,
      recipe: {},
      recipes: [],
      saving: false,
      hover: true,
      lineSelected: null,
      subLineSelected: null,
      stationSelected: null,
      showLineFilter: true,
      flagNewUpdate: false,
      updateRecipeNumber: '',
      editedVersionNumber: 0,
      itemForDelete: null,
      input: {
        sublinename: '',
        machinename: '',
      },
    };
  },
  async created() {
    await this.getReworkList('?query=overallresult!="1"');
    await this.getNgCodeRecords('');
  },
  computed: {
    ...mapState('reworkOperation', ['reworkList', 'ngCodeDetails']),
  },
  methods: {
    ...mapActions('reworkOperation', ['getReworkList', 'getNgCodeRecords']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('reworkOperation', ['toggleFilter']),
    handleClick(value) {
      this.$router.push({ name: 'reworkDetails', params: { id: value } });
    },
    async refreshUi() {
      this.getReworkList('?query=overallresult!="1"');
    },
    async btnSearch() {
      const fromDate = new Date(this.fromdate).getTime();
      const toDate = new Date(this.todate).getTime();
      if (!fromDate && !toDate) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_DATE',
        });
      } else if (!fromDate || !toDate) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'EITHER_DATE_EMPTY',
        });
      } else {
        this.getReworkList(`?datefrom=${fromDate}&dateto=${toDate}&pagenumber=1&pagesize=20`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'GET_RECORDS_DATE_RANGE',
        });
      }
    },
  },
};
</script>
