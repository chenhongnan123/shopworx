<template>
  <div id="machine">
    <portal to="app-header">
      <span>{{ $t('machine.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0">
      <div class="stick">
        <div style="float: left; margin-bottom: 10px">
          <span v-if="lineList.length && !!lineValue" class="ml-2">
            {{ $t('machine.general.line') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setLineValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ lineList.filter((item) => item.id === lineValue)[0].name }}
              </div>
            </v-btn>
          </span>
          <span v-if="sublineList.length && !!sublineValue" class="ml-2">
            {{ $t('machine.general.subline') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setSublineValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ sublineList.filter((item) => item.id === sublineValue)[0].name }}
              </div>
            </v-btn>
          </span>
        </div>
        <div style="float: right">
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('machine.general.refresh') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('machine.general.filter') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        item-key="_id"
        :items="machineList"
        :options="{ itemsPerPage: 10 }"
      >
        <template v-slot:item.machinename="{ item }">
          <span @click="handleClick(item)"
            ><a>{{ item.machinename }}</a></span
          >
        </template>
      </v-data-table>
      <machine-filter />
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import MachineFilter from '../components/MachineFilter.vue';

export default {
  name: 'Machine',
  components: {
    MachineFilter,
  },
  data() {
    return {
      headers: [
        { text: this.$t('machine.main.header.id'), value: 'id' },
        { text: this.$t('machine.main.header.name'), value: 'machinename' },
        { text: this.$t('machine.main.header.description'), value: 'description' },
        { text: this.$t('machine.main.header.editedtime'), value: 'modifiedtimestamp' },
        { text: this.$t('machine.main.header.createdtime'), value: 'createdTimestamp' },
      ],
    };
  },
  computed: {
    ...mapState('machine', [
      'filter',
      'lineList',
      'sublineList',
      'lineValue',
      'sublineValue',
      'machineList',
      'assets',
    ]),
  },
  async created() {
    this.getAssets();
    await this.getLines();
    await this.getSublines();
    this.getRecords('?pagenumber=1&pagesize=10');
  },
  watch: {
    lineValue(val) {
      if (!val) {
        this.setLineValue('');
        this.setSublineValue('');
        this.getRecords(this.getQuery());
      }
    },
    sublineValue(val) {
      if (!val) {
        this.setSublineValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
  methods: {
    ...mapMutations('machine', [
      'setFilter',
      'toggleFilter',
      'setLineValue',
      'setSublineValue',
      'setApply',
    ]),
    ...mapActions('machine', [
      'updateMachine',
      'deleteMachine',
      'createMachine',
      'createMachineList',
      'getLines',
      'getSublines',
      'getRecords',
      'getAssets',
    ]),
    handleClick(value) {
      this.$router.push({ name: 'machinedetail', params: { id: value.id } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.lineValue) {
        query += `%26%26lineid==${this.lineValue}`;
      }
      if (this.sublineValue) {
        query += `%26%26sublineid=="${this.sublineValue}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
  },
};
</script>

<style lang="sass">
#machine
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
</style>
