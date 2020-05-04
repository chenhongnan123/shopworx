<template>
  <v-card-text>
    <v-expansion-panels
      flat
      accordion
    >
      <v-expansion-panel v-if="missingTags && missingTags.length">
        <v-expansion-panel-header class="pa-0 ma-0">
          {{ $tc('setup.importMaster.missingMapping', missingTags.length) }}
          </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(data, n) in missingTags" :key="n">{{ data }}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row
      v-for="(item, index) in items"
      :key="index"
    >
      <v-col cols="3" class="my-auto">
        <span class="font-weight-medium">
          {{ index + 1 }}.
        </span>
        <span
          class="font-weight-medium ml-2"
          v-text="item.column"
        ></span>
      </v-col>
      <v-col cols="5">
        <v-autocomplete
          clearable
          hide-details
          :items="masterTags"
          item-value="tagName"
          item-text="tagDescription"
          v-model="item.tagName"
          @change="mapColumn(index)"
          label="Lookup matching column"
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-switch
          hide-details
          v-model="item.ignore"
          @change="ignoreColumn(index)"
          label="Ignore"
        ></v-switch>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  name: 'ReviewColumn',
  props: {
    matchedColumns: {
      type: Array,
      required: true,
    },
    masterTags: {
      type: Array,
      required: true,
    },
    missingTags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.items = this.matchedColumns;
  },
  watch: {
    matchedColumns(val) {
      this.items = val;
    },
  },
  methods: {
    mapColumn(index) {
      if (this.items[index].tagName) {
        this.items[index].ignore = null;
      } else {
        this.items[index].ignore = true;
      }
    },
    ignoreColumn(index) {
      if (this.items[index].ignore) {
        this.items[index].tagName = null;
      }
    },
  },
};
</script>
