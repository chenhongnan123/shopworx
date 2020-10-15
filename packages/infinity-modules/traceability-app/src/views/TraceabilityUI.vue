<template>
<div style="height:100%">
    <portal to="app-header">
      <span>Traceability</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal
      to="app-extension"
    >
        <v-toolbar
          flat
          dense
          class="stick pa-0"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-text-field
        class="mt-2 mr-2"
        v-model="newTrecibility.searchMainID"
        append-icon="mdi-magnify"
        label="Search ID"
        single-line
        hide-details
        clearable
        ></v-text-field>
        <v-autocomplete
          clearable
          class="mt-8 mr-4"
          label="Select Subline"
          :items="subLineList"
          return-object
          item-text="name"
          v-model="newTrecibility.selectedSubLine"
          @change="handleSubLineClick"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-autocomplete
          clearable
          class="mt-8 mr-4"
          label="Select SubStation"
          :items="sortedSubStation"
          return-object
          item-text="name"
          v-model="newTrecibility.selectedSubStation"
          @change="handleStationClick"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
          class="mt-8"
          type="datetime-local"
          v-model="newTrecibility.fromdate"
          label="From date"
        ></v-text-field>
        <v-text-field
          class="mt-8 ml-4"
          type="datetime-local"
          v-model="newTrecibility.todate"
          label="To date"
        ></v-text-field>
        <v-btn small color="primary" class="text-none ml-2" @click="btnSearch">
            Search
          </v-btn>
        </v-toolbar>
    </portal>
    <!-- <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
        <v-spacer></v-spacer>
         <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            :disabled="prevDisabled"
            @click="prevSearch((pageNumber-=1))">Prev
            </v-btn>
            <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="nextSearch(pageNumber+=1)">Next
            </v-btn>
        </v-toolbar> -->
    <PartStatusView ref="partstatus" :pageNumber="pageNumber"/>
    <v-tabs
        dense
        center-active
        v-model="recipeView"
      >
        <v-tab class="text-none">
          Components
        </v-tab>
        <v-tab class="text-none">
          Parameters
        </v-tab>
        <v-tab class="text-none">
          Quality History
        </v-tab>
      </v-tabs>
    <!-- <recipe-filter></recipe-filter> -->
    <template>
      <v-fade-transition mode="out-in">
          <overall-list v-if="recipeView === 0"  ref="overall" :pageNumber="pageNumber"/>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
          <process-parameters v-if="recipeView === 1" ref="process" :pageNumber="pageNumber"/>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
          <quality-history-view v-if="recipeView === 2" ref="quality" :pageNumber="pageNumber" />
      </v-fade-transition>
    </template>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import OverallList from './OverallList.vue';
import ProcessParameters from './ProcessParameters.vue';
import PartStatusView from './PartStatusView.vue';
import QualityHistoryView from './QualityHistoryView.vue';

export default {
  name: 'Trecibility',
  components: {
    OverallList,
    ProcessParameters,
    PartStatusView,
    QualityHistoryView,
  },
  async updated() {
    this.backAndfourth();
  },
  async created() {
    const view = localStorage.getItem('planView');
    this.recipeView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
    await this.getSubLines('');
    await this.getSubStations();
    // await this.fetchRecords();
    await this.showInput();
  },
  data() {
    return {
      // recipeView: 0,
      pageNumber: 1,
      prevDisabled: false,
    };
  },
  computed: {
    ...mapState('traceabilityApp', [
      'recipeViewState',
      'subLineList',
      'subStationList',
      'trecibilityState',
      'componentList',
      'sortedSubStation',
    ]),
    recipeView: {
      get() {
        return this.recipeViewState;
      },
      set(val) {
        this.setRecipeViewState(val);
      },
    },
    newTrecibility: {
      get() {
        return this.trecibilityState;
      },
      set(val) {
        this.setTrecibilityState(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('helper', ['setExtendedHeader', 'setTrecibilityState']),
    ...mapMutations('traceabilityApp', ['setRecipeViewState']),
    ...mapActions('traceabilityApp', ['getSubStations', 'getComponentList', 'getSortedSubStations', 'getSubLines']),
    ...mapActions('element', ['getRecords']),
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getSortedSubStations(query);
    },
    async backAndfourth() {
      if (this.pageNumber === 1) {
        this.prevDisabled = true;
      } else {
        this.prevDisabled = false;
      }
    },
    async showInput() {
      const subline = this.subLineList;
      const firstSubline = subline[0];
      this.newTrecibility.selectedSubLine = firstSubline;
      // this.newTrecibility.fromdate = '2020-09-21T13:59';
      // const tDate = (new Date()).toISOString().slice(0, 16).replace(/-/g, '-');
      // const cDate = new Date(tDate).getTime();
      // alert(tDate);
      // this.newTrecibility.todate = tDate;
      this.setAlert({
        show: true,
        type: 'success',
        message: 'FETCH_RECORD',
      });
    },
    async btnSearch() {
      if (this.newTrecibility.fromdate && this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else if (this.newTrecibility.fromdate && !this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else if (!this.newTrecibility.fromdate && this.newTrecibility.todate
         && !this.newTrecibility.selectedSubLine) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECT_SUBLINE',
        });
      } else {
        await this.$refs.partstatus.btnSearchCheckOut();
        // this.$refs.partstatus.handleSubLineClick();
        if (this.recipeView === 0) {
          this.$refs.overall.btnSearchCheckOut();
          this.$refs.overall.handleSubLineClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
        if (this.recipeView === 1) {
          this.$refs.process.btnSearchProcessParameters();
          this.$refs.process.handleStationClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
        if (this.recipeView === 2) {
          this.$refs.quality.btnSearchProcessParameters();
          this.$refs.quality.handleStationClick();
          // this.$refs.partstatus.btnSearchCheckOut();
        }
      }
    },
    async nextSearch() {
      this.$refs.partstatus.nextSearch();
      if (this.recipeView === 0) {
        this.$refs.overall.nextSearch();
      }
      if (this.recipeView === 1) {
        this.$refs.process.nextSearch();
      }
      if (this.recipeView === 2) {
        this.$refs.quality.nextSearch();
      }
    },
    async prevSearch() {
      this.$refs.partstatus.prevSearch();
      if (this.recipeView === 0) {
        this.$refs.overall.prevSearch();
      }
      if (this.recipeView === 1) {
        this.$refs.process.prevSearch();
      }
      if (this.recipeView === 2) {
        this.$refs.quality.prevSearch();
      }
    },
    // async clearInput() {
    //   this.newTrecibility.selectedSubLine = '';
    // },
  },
};
</script>
