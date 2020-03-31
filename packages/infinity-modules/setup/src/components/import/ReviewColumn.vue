<template>
  <div>
    <v-card-text>
      <span
        v-if="missingTags.length"
        class="font-weight-medium"
      >
        {{ $t('setup.importMaster.missingMapping') }}
        {{ missingTags.join(',') }}
      </span>
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
    <v-card-actions>
      <v-btn
        @click="save"
        color="primary"
        class="text-none"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        {{ $t('setup.importMaster.save') }}
      </v-btn>
      <v-btn
        text
        color="primary"
        class="text-none"
        @click="$emit('cancel')"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        {{ $t('setup.importMaster.cancel') }}
      </v-btn>
    </v-card-actions>
  </div>
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
    save() {
      this.$emit('save', this.items);
    },
  },
};
</script>
