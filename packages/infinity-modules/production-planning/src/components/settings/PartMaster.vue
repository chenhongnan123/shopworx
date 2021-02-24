<template>
  <div>
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
    <v-text-field
      dense
      rounded
      outlined
      single-line
      hide-details
      class="mt-4"
      v-model="search"
      prepend-inner-icon="$search"
      label="Filter by machine or equipment"
    ></v-text-field>
    <v-data-table
      :items="partMatrixList"
      :headers="headers"
      item-key="_id"
      dense
      class="transparent mt-2"
      :search="search"
      :loading="loading"
      show-expand
      single-expand
      disable-pagination
      hide-default-footer
      :expanded.sync="expanded"
      :custom-filter="filterMatrix"
    >
      <template #loading>
        Fetching matrix...
      </template>
      <template #no-data>
        No matrix available
      </template>
      <template #no-results>
        No matching matrix found for '{{ search }}'
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-card-text>
            <edit-matrix
              :partMatrixFields="partMatrixFields"
              :partMatrixData="item"
              @on-edit="updateMatrixList"
            />
          </v-card-text>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import EditMatrix from './part/EditMatrix.vue';

export default {
  name: 'AssetConfig',
  components: {
    EditMatrix,
  },
  data() {
    return {
      expanded: [],
      search: '',
      selectedPart: '',
      partMatrixList: [],
      loading: false,
      headers: [{
        text: 'Machine',
        value: 'machinename',
      }, {
        text: 'Equipment',
        value: 'equipmentname',
      }],
      partMatrixFields: [],
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
    filterMatrix(value, search, item) {
      return item.machinename
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1
        || item.equipmentname
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
    },
    async onPartSelection() {
      this.partMatrixList = [];
      this.partMatrixFields = [];
      if (this.selectedPart) {
        this.loading = true;
        const matrixTags = this.partMatrixTags(this.selectedPart.assetid);
        const tagsToRemove = ['partname', 'machinename', 'moldname', 'toolname'];
        this.partMatrixFields = matrixTags
          .filter((tag) => !tagsToRemove.includes(tag.tagName))
          .map((tag) => ({
            text: tag.tagDescription,
            value: tag.tagName,
            type: tag.emgTagType,
          }));
        this.partMatrixList = await this.fetchPartMatrix(this.selectedPart);
        this.loading = false;
      }
    },
    updateMatrixList(e) {
      // eslint-disable-next-line
      const index = this.partMatrixList.findIndex((p) => p._id === e._id);
      this.$set(this.partMatrixList, index, e);
    },
  },
};
</script>
