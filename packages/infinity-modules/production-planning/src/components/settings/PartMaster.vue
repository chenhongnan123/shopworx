<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'mdi-plus'"
          ></v-icon>
        Add new part
        </v-btn>
      </span>
    </portal>
    <v-responsive :max-width="400">
      <v-autocomplete
        filled
        label="Part"
        :items="partList"
        item-text="partname"
        return-object
        hide-details
        v-model="selectedPart"
        :title="selectedPart ? selectedPart.partname : ''"
      >
        <template #item="{ item }">
          <v-list-item-content>
            <v-list-item-title v-text="item.partname"></v-list-item-title>
            <v-list-item-subtitle v-text="item.partnumber"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </v-responsive>
    <v-data-table
      :items="partMatrixList"
      :headers="headers"
      item-key="_id"
      dense
      show-select
      :loading="loading"
    ></v-data-table>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'AssetConfig',
  data() {
    return {
      selectedPart: '',
      partMatrixList: [],
      loading: false,
      headers: [{
        text: 'Machine',
        value: 'machinename',
        width: '20%',
      }, {
        text: 'Equipment',
        value: 'equipmentname',
        width: '20%',
      }],
    };
  },
  computed: {
    ...mapState('productionPlanning', ['parts']),
    ...mapGetters('productionPlanning', ['partMatrixTags']),
    partList() {
      return sortArray(this.parts, 'partname');
    },
  },
  async created() {
    this.loading = true;
    if (this.partList && this.partList.length) {
      // eslint-disable-next-line
      this.selectedPart = this.partList[0];
    }
    this.loading = false;
  },
  watch: {
    selectedPart() {
      this.onPartSelection();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionPlanning', ['fetchPartMatrix']),
    filterParts(value, search, item) {
      return item.partname
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1
        || item.partnumber
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
    },
    async onPartSelection() {
      this.partMatrixList = [];
      this.headers = [{
        text: 'Machine',
        value: 'machinename',
        width: '20%',
      }, {
        text: 'Equipment',
        value: 'equipmentname',
        width: '20%',
      }];
      if (this.selectedPart) {
        this.loading = true;
        const matrixTags = this.partMatrixTags(this.selectedPart.assetid);
        const tagsToRemove = ['partname', 'machinename', 'moldname', 'toolname'];
        const partMatrixHeaders = matrixTags
          .filter((tag) => !tagsToRemove.includes(tag.tagName))
          .map((tag) => ({
            text: tag.tagDescription,
            value: tag.tagName,
          }));
        this.headers = [
          ...this.headers,
          ...partMatrixHeaders,
        ];
        this.partMatrixList = await this.fetchPartMatrix(this.selectedPart);
        this.loading = false;
      }
    },
  },
};
</script>
