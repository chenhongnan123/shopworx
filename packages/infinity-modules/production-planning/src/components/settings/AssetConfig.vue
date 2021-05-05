<template>
  <div>
    <v-text-field
      dense
      rounded
      outlined
      single-line
      hide-details
      v-model="search"
      prepend-inner-icon="$search"
      :label="$t('planning.filterAssets')"
    ></v-text-field>
    <v-data-table
      dense
      item-key="_id"
      class="transparent mt-2"
      :search="search"
      :items="assets"
      :headers="headers"
      disable-pagination
      hide-default-footer
      :loading="loading"
      :custom-filter="filterAssets"
    >
      <template #loading>
        {{ $t('planning.fetchingAsset') }}
      </template>
      <template #no-data>
        {{ $t('planning.noAsset') }}
      </template>
      <template #no-results>
        {{ $t('planning.noAssetResult', { search }) }}
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.machinename="{ item }">
        <div><strong>{{ item.machinename }}</strong></div>
        <div>{{ item.machinecode }}</div>
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.manualplanstart="{ item }">
        <v-checkbox
          :input-value="!item.manualplanstart"
          hide-details
          disabled
          class="ma-0 pa-0"
          @change="updateAssetConfig({
            id: item._id,
            payload: { manualplanstart: !item.manualplanstart }
          })"
        ></v-checkbox>
      </template>
    <!-- eslint-disable-next-line -->
      <template #item.manualplanstop="{ item }">
        <v-checkbox
          :input-value="!item.manualplanstop"
          hide-details
          disabled
          class="ma-0 pa-0"
          @change="updateAssetConfig({
            id: item._id,
            payload: { manualplanstop: !item.manualplanstop }
          })"
        ></v-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'AssetConfig',
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        {
          text: this.$t('planning.asset'),
          value: 'machinename',
          width: '60%',
        },
        {
          text: this.$t('planning.autoPlanStart'),
          value: 'manualplanstart',
          sortable: false,
        },
        {
          text: this.$t('planning.autoPlanComplete'),
          value: 'manualplanstop',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('productionPlanning', ['machines']),
    assets() {
      return sortArray(this.machines, 'machinename');
    },
  },
  async created() {
    this.loading = true;
    await this.fetchMachines();
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionPlanning', ['fetchMachines', 'updateMachine']),
    filterAssets(value, search, item) {
      return item.machinename
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1
        || item.machinecode
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
    },
    async updateAssetConfig({ id, payload }) {
      const updated = await this.updateMachine({ id, payload });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'ASSET_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ASSET_UPDATE',
        });
      }
    },
  },
};
</script>
