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
            <div class="title">Select atleast one asset</div>
            <template v-for="item in items">
              <v-checkbox
                hide-details
                :key="item.id"
                :label="item.name"
                v-model="item.selected"
              ></v-checkbox>
              <v-card flat :key="`r-${item.id}`" v-if="item.selected">
                <v-card-text>
                  {{ item }}
                </v-card-text>
              </v-card>
            </template>
          </div>
          <div v-else>
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'AssetsAndLicense',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: 0,
      loading: false,
      isValid: false,
      items: [],
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
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
    await this.getAssets();
    this.items = this.assets.map((a) => ({
      id: a.id,
      name: a.assetDescription,
      selected: false,
      assetsPayload: [],
      licensePayload: {
        license: '',
        status: 'ACTIVE',
        assetId: a.id,
        totalAssetCount: 0,
        currentAssetCount: 0,
        expiryTimestamp: 1924972199000, // 31st Dec, 2030
        expiryDate: '31-12-2030',
        category: '',
        comments: '',
        beginTimestamp: '',
        begineDate: '',
      },
    }));
    if (this.info.data) {
      this.setDetails();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('newCustomer', [
      'assets',
      'customerData',
      'selectedIndustry',
    ]),
    isSelected() {
      return !!this.items.filter((i) => i.selected).length;
    },
  },
  methods: {
    ...mapActions('newCustomer', ['getAssets']),
    ...mapMutations('newCustomer', [
      'updateCustomerData',
      'setSelectedIndustry',
    ]),
    addNewAsset() {
      const pos = this.tab + 1;
      this.items.push({
        name: `Asset ${pos}`,
      });
      this.tab += 1;
    },
    deleteAsset() {
      this.items.splice(this.tab, 1);
    },
    setDetails() {},
    save() {
      const data = {
        key: 2,
        data: null,
        status: 'complete',
      };
      this.updateCustomerData(data);
      localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
      this.$router.push({ params: { id: 3 } });
    },
  },
};
</script>
