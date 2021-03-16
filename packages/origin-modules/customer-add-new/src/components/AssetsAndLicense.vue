<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <v-card flat class="transparent" fill-height>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <perfect-scrollbar>
        <v-card-text style="max-height: calc(100vh - 156px);">
          <div v-if="items.length">
            <div class="title">Select atleast one asset type</div>
            <template v-for="item in items">
              <v-checkbox
                hide-details
                :key="item.id"
                :label="item.name"
                v-model="item.selected"
              ></v-checkbox>
              <asset-input
                :ref="`asset${item.id}`"
                :asset-info="item"
                v-if="item.selected"
                :key="`input-${item.id}`"
              />
            </template>
          </div>
          <div v-else-if="!loading">
            Provision customer and site to view this section.
          </div>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          block
          v-if="items.length"
          :disabled="!isValid || !isSelected"
          color="primary"
          type="submit"
        >
          Save & proceed
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import AssetInput from './assets/AssetInput.vue';

export default {
  name: 'AssetsAndLicense',
  components: {
    AssetInput,
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      isValid: false,
      items: [],
      licensePayload: {
        license: '',
        status: 'ACTIVE',
        assetId: '',
        totalAssetCount: 0,
        currentAssetCount: 0,
        expiryTimestamp: 1924972199000, // 31st Dec, 2030
        expiryDate: '31-12-2030',
        category: '',
        comments: '',
        beginTimestamp: '',
        begineDate: '',
      },
    };
  },
  async created() {
    this.loading = true;
    if (this.customerData['1'].data) {
      const { customerPayload } = this.customerData['1'].data;
      const {
        industryId,
      } = customerPayload;
      this.setSelectedIndustry(industryId);
    }
    await Promise.all([
      this.getAssets(),
      this.getMasterElementsAndTags(),
    ]);
    this.items = this.assets.map((a) => {
      let element = null;
      let tags = [];
      if (a.assetName === 'press' || a.assetName === 'injectionmolding') {
        ({ element, tags } = this.machineElement(a.id));
      } else if (a.assetName.includes('meter')) {
        ({ element, tags } = this.meterElement(a.id));
      }
      return {
        id: a.id,
        name: a.assetDescription,
        selected: false,
        element,
        tags,
      };
    });
    if (this.info.data) {
      this.setDetails();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('newCustomer', [
      'assets',
      'masterElementsandTags',
      'customerData',
      'selectedIndustry',
    ]),
    ...mapGetters('newCustomer', [
      'machineElement',
      'meterElement',
    ]),
    isSelected() {
      return !!this.items.filter((i) => i.selected).length;
    },
  },
  methods: {
    ...mapActions('newCustomer', [
      'getAssets',
      'getMasterElementsAndTags',
    ]),
    ...mapMutations('newCustomer', [
      'updateCustomerData',
      'setSelectedIndustry',
    ]),
    setDetails() {},
    save() {
      console.log(this.$refs);
      /* const data = {
        key: 2,
        data: null,
        status: 'complete',
      };
      this.updateCustomerData(data);
      localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
      this.$router.push({ params: { id: 3 } }); */
    },
  },
};
</script>
