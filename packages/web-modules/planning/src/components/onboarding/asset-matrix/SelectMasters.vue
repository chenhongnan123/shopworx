<template>
  <v-card
    flat
    class="transparent"
    style="height: 100%"
  >
    <v-card-text class="pa-0">
      <template v-for="master in masters">
        <v-checkbox
          hide-details
          :key="master.title"
          :value="master"
          :label="master.title"
          v-model="selected"
        ></v-checkbox>
      </template>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="selectTags"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.importData.buttons.continue')"
      ></v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'SelectMasters',
  props: {
    assetId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isValid: false,
      selected: [],
    };
  },
  computed: {
    ...mapGetters('planning', ['masterAssetElements']),
    masters() {
      let masters = [];
      if (this.masterAssetElements && this.masterAssetElements.length) {
        masters = this.masterAssetElements
          .filter((elem) => elem.element.elementName !== 'assetpartmatrix')
          .map((elem) => ({
            title: elem.element.elementDescription,
            element: elem.element.elementName,
            tags: elem.tags.filter((tag) => (
              (elem.element.assetBased && tag.assetId === this.assetId)
              || tag.assetId === 0
            )),
          }));
      }
      return masters;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    validateData() {
      this.isValid = false;
      if (this.selected && this.selected.length > 1) {
        this.isValid = true;
      }
    },
    selectTags() {
      this.validateData();
      if (this.isValid) {
        this.$emit('master-selected', this.selected);
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SELECTION_REQUIRED',
        });
      }
    },
  },
};
</script>
