<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <v-row
        v-for="(item, index) in items"
        :key="index"
      >
        <v-col cols="3" lg="4" class="my-auto">
          <span class="font-weight-medium">
            {{ index + 1 }}.
          </span>
          <span
            class="font-weight-medium ml-2"
            v-text="item.field"
          ></span>
        </v-col>
        <v-col cols="4" lg="5">
          <v-select
            outlined
            hide-details
            :items="tags"
            item-value="tagName"
            item-text="tagDescription"
            v-model="item.tagName"
            :label="$t('onboarding.matchColumns.labels.lookUp')"
          ></v-select>
        </v-col>
        <v-col cols="5" lg="3" class="my-auto">
          <v-btn
            outlined
            color="success"
            class="text-none"
            v-if="item.tagName"
            @click="edit(index)"
            v-text="$t('onboarding.matchColumns.buttons.edit')"
          >
          </v-btn>
          <v-btn
            outlined
            color="error"
            class="text-none ml-2"
            @click="ignoreColumn(index)"
          >
            {{ !item.ignore
              ? $t('onboarding.matchColumns.buttons.ignoreColumn')
              : $t('onboarding.matchColumns.buttons.columnIgnored')
            }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="matchColumns"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.matchColumns.buttons.continue')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'MatchOnboardingColumns',
  props: {
    tags: {
      type: Array,
      required: true,
    },
    fields: {
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
    this.mapItems();
  },
  watch: {
    fields() {
      this.mapItems();
    },
  },
  computed: {
    filteredTags() {
      const tagNames = this.items.map((tag) => tag.tagName);
      return this.tags.filter((tag) => !tagNames.includes(tag.tagName));
    },
  },
  methods: {
    mapItems() {
      this.items = this.fields.map((field) => {
        const currentTag = this.tags.find((tag) => tag.tagDescription === field);
        let tagName = null;
        if (currentTag) {
          ({ tagName } = currentTag);
        }
        return {
          field,
          tagName,
          ignore: false,
        };
      });
    },
    edit(index) {
      this.items[index].tagName = null;
    },
    ignoreColumn(index) {
      this.items[index].ignore = !this.items[index].ignore;
      this.items[index].tagName = null;
    },
    getKeysMap() {
      return this.items
        .filter((item) => !item.ignore && item.tagName)
        .reduce((acc, cur) => {
          acc[cur.field] = cur.tagName;
          return acc;
        }, {});
    },
    isKeyMultiMapped() {
      const cols = Object.values(this.getKeysMap);
      const uniqueCols = [...new Set(cols)];
      return cols.length !== uniqueCols.length;
    },
    matchColumns() {
      console.log(this.getKeysMap());
      if (this.filteredTags.some((tag) => tag.required)) {
        const error = {
          errorMessage: 'Please map all required fields',
          errorCode: 'FIELD_MAPPING_REQUIRED',
        };
        this.$root.$snackbar.error(error);
      } else if (this.isKeyMultiMapped()) {
        const error = {
          errorMessage: 'One column mapped with multiple fields',
          errorCode: 'MULTI_MAPPING_FOUND',
        };
        this.$root.$snackbar.error(error);
      } else {
        const keysMap = this.getKeysMap();
        this.$emit('columns-matched', keysMap);
      }
    },
  },
};
</script>
