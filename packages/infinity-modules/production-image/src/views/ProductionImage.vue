<template>
  <v-container id="production-image" fluid class="py-0">
    <portal to="app-header">{{ $t('Production Image') }}</portal>
    <v-row id="form">
      <v-col cols="11" md="11" lg="11">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212' : ''"
          id="toolbar"
        >
          <v-text-field
            class="mr-2"
            v-model="mainid"
            :label="$t('Search Main ID')"
            single-line
            hide-details
          ></v-text-field>
          <v-autocomplete
            clearable
            class="mt-6 mr-4"
            :label="$t('Select Line')"
            return-object
            item-text="name"
            :items="lineList"
            v-model="selectedLine"
            @change="handleLineClick"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            class="mt-6 mr-4"
            :label="$t('Select Sub-Line')"
            return-object
            item-text="name"
            :items="subLineList"
            v-model="selectedSubLine"
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
            class="mt-6 mr-4"
            :label="$t('Select Station')"
            return-object
            item-text="name"
            :items="stationList"
            v-model="selectedStation"
            @change="handleStationClick"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            class="mt-6 mr-4"
            :label="$t('Select Sub-Station')"
            return-object
            item-text="name"
            :items="subStationList"
            v-model="selectedSubStation"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            class="mt-6"
            type="datetime-local"
            v-model="fromdate"
            :label="$t('From date')"
          ></v-text-field>
          <v-text-field
            class="mt-6 ml-6"
            type="datetime-local"
            :label="$t('To date')"
            v-model="todate"
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
      <v-col cols="1" md="1" lg="1">
        <v-btn
          color="primary"
          @click="search"
          :disabled="
            !mainid &&
            !selectedLine &&
            !selectedSubLine &&
            !selectedStation &&
            !selectedSubStation
          "
          >
          {{ $t('Search') }}
          </v-btn
        >
      </v-col>
    </v-row>
    <div id="imageviewer" v-if="items.length > 0">
      <div id="display">
        <div id="prev">
          <img :src="items[selected].src" alt="" srcset="" />
        </div>
        <div id="info">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon x-large color="blue">mdi-alert-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-breadcrumbs :items="infos" large>
                  <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-breadcrumbs>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </div>
      <div id="images">
        <div id="up" class="ctrl" @click="scrollToUp">
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 330 330"
            style="enable-background: new 0 0 330 330"
            xml:space="preserve"
          >
            <path
              fill="white"
              id="XMLID_224_"
              d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,
          75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
            l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,
            15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
            C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,
            10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
            />
          </svg>
        </div>
        <div id="content">
          <div class="piccontainer" v-for="(item, index) in items" :key="index">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <img
                  v-if="item"
                  :src="item.src"
                  alt=""
                  srcset=""
                  style="width: 200px"
                  :class="{ selected: selected == index }"
                  @click="selected = index"
                  v-on="on"
                />
              </template>
              <span
                >mainid: {{ item.mainid }} <br />
                time: {{ item.createdTimestamp.replace(':', ' ') }}</span
              >
            </v-tooltip>
          </div>
        </div>
        <div id="down" class="ctrl" @click="scrollToDown">
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 330 330"
            style="enable-background: new 0 0 330 330"
            xml:space="preserve"
          >
            <path
              fill="white"
              id="XMLID_224_"
              d="M325.606,229.393l-150.004-150C172.79,76.58
            ,168.974,
            75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
              l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,
              15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
              C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,
              10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
            />
          </svg>
        </div>
      </div>
    </div>
    <v-overlay id="loading" v-model="loading" width="100" absolute light>
      <v-card light width="200" height="200" align-self="center">
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 50 50"
          style="enable-background: new 0 0 50 50"
          xml:space="preserve"
        >
          <path
            fill="#FF6700"
            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,
          18.683h4.068c0-8.071
          ,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <p>loading</p>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
// import chunk from 'lodash.chunk';
// import sortBy from 'lodash.sortby';
import Element from '@shopworx/services/api/element.service';
import ApiService from '@shopworx/services/api/api.service';
import axios from 'axios';

export default {
  name: 'ProductionImage',
  data() {
    return {
      mainid: '',
      fromdate: null,
      todate: null,
      selected: 0,
      scrolltop: 0,
      selectedLine: null,
      selectedSubLine: null,
      selectedStation: null,
      selectedSubStation: null,
      loading: false,
      items: [],
    };
  },
  mounted() {},
  async created() {
    await this.getLines('');
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionImage', [
      'getLines',
      'getSubLines',
      'getStations',
      'getSubStations',
    ]),
    async handleLineClick(item) {
      const query = `?query=lineid==${item.id}`;
      await this.getSubLines(query);
    },
    async handleSubLineClick(item) {
      const query = `?query=sublineid=="${item.id}"`;
      await this.getStations(query);
    },
    async handleStationClick(item) {
      const query = `?query=stationid=="${item.id}"`;
      await this.getSubStations(query);
    },
    async search() {
      const that = this;
      that.items = [];
      that.loading = true;
      let query = '';
      if (that.mainid) {
        query += `mainid=="${that.mainid}"%26%26`;
      }
      if (that.selectedLine) {
        query += `lineid==${that.selectedLine.id}%26%26`;
      }
      if (that.selectedSubLine) {
        query += `sublineid=="${that.selectedSubLine.id}"%26%26`;
      }
      if (that.selectedStation) {
        query += `stationid=="${that.selectedStation.id}"%26%26`;
      }
      if (that.selectedSubStation) {
        query += `substationid=="${that.selectedSubStation.id}"%26%26`;
      }
      if (that.fromdate) {
        query += `timestamp>=${new Date(that.fromdate).getTime()}%26%26`;
      }
      if (that.todate) {
        query += `timestamp<=${new Date(that.todate).getTime()}%26%26`;
      }
      const response = await that.getReference(query);
      that.loading = false;
      response.data.results.forEach((item) => {
        axios
          .get(`/server${item.image}?disposition=inline`, {
            responseType: 'blob',
            headers: {
              sessionId: ApiService.instance.defaults.headers.common.sessionId,
            },
          })
          .then((image) => {
            const q = `?query=id=="${item.lineid || 1}"`;
            this.getLines(q).then((res) => {
              let name = '';
              if (res[0]) {
                name = res[0].name;
              }
              this.items.push({
                src: window.URL.createObjectURL(image.data),
                ...item,
                linename: name,
              });
            });
          });
      });
    },

    getReference(query) {
      // const that = this;
      const element = 'productionimageinfo';
      const queryParam = `?query=${query}assetid>0`;
      return Element.getRecords(element, queryParam);
    },

    scrollToUp() {
      if (this.scrolltop - 100 <= 0) {
        this.scrolltop = 0;
      } else {
        this.scrolltop -= 100;
      }
      document.querySelector('#content').scrollTop = this.scrolltop;
    },

    scrollToDown() {
      const wh = document.querySelector('#content').clientHeight;
      const sh = document.querySelector('#content').scrollHeight;
      if (this.scrolltop + 100 >= sh - wh) {
        this.scrolltop = sh - wh;
      } else {
        this.scrolltop += 100;
      }
      document.querySelector('#content').scrollTop = this.scrolltop;
    },
  },
  computed: {
    ...mapState('productionImage', [
      'lineList',
      'subLineList',
      'stationList',
      'subStationList',
    ]),
    infos() {
      const that = this;
      return [
        {
          text: that.items[that.selected].linename,
          disabled: true,
        },
        {
          text: that.items[that.selected].sublineid || '',
          disabled: true,
        },
        {
          text: that.items[that.selected].stationid || '',
          disabled: true,
        },
        {
          text: that.items[that.selected].substationid || '',
          disabled: true,
        },
        {
          text: that.items[that.selected].mainid || '',
          disabled: true,
        },
        {
          text: that.items[that.selected].createdTimestamp.replace(':', ' '),
          disabled: true,
        },
      ];
    },
  },
};
</script>
<style lang="sass" scoped>
#production-image
  width: 100%
  height: calc(100vh - 56px)
  padding: 0 40px 20px 40px !important
  display: grid
  grid-template-rows: 60px calc(100% - 80px)
  grid-template-columns: 1fr
  overflow: hidden
  gap: 20px
  #form
    width: calc(100% - 0px)
  #imageviewer
    width: 100%
    height: calc(100% - 0px)
    display: grid
    grid-template-rows: 100%
    grid-template-columns: 1fr 250px
    gap: 40px
    #display
      display: grid
      grid-template-rows: 1fr 60px
      grid-template-columns: 1fr
      #prev
        display: grid
        place-items: center
        img
          height: 100%
          max-width: 100%
      #info
        display: grid
        grid-template-rows: 1fr
        gap: 0px
        grid-template-columns: 1fr
        .v-list-item__icon
          margin-right: 0px
    #images
      width: 100%
      height: 100%
      overflow: auto
      display: grid
      grid-template-rows: 32px 1fr 32px
      grid-template-columns: 1fr
      padding: 0 10px
      gap: 5px
      .ctrl
        display: grid
        place-items: center
        cursor: pointer
        border-radius: 5px
        transition: all 0.5s
        &:hover
          background: rgba(150,150,150,0.5)
        svg
          height: 32px
          filter: drop-shadow(1px 1px 2px black)
        &#down
          svg
            transform: rotate(180deg)
      #content
        overflow-y: auto
        position: relative
        height: auto
        width: 240px
        min-width: 100%
        max-height: 100%
        display: grid
        grid-template-columns: 1fr
        border-radius: 5px
        gap: 10px
        padding: 10px 0
        .piccontainer
          display: grid
          place-items: center
          position: relative
          height: auto
          img
            position: relative
            margin-right: 0px
            filter: brightness(0.5)
            cursor: pointer
            border-radius: 5px
            transition: transform 0.5s
            &:hover
              filter: brightness(1)
              border: 4px solid orange
            &.selected
              filter: brightness(1)
              border: 4px solid orange
              transform: scale(1.1)

  #loading
    .v-card
      display: grid
      place-items: center
      grid-template-rows: 150px 50px
</style>
