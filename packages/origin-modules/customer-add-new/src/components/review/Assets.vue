<template>
  <v-card flat v-if="payload && payload.length">
    <v-card-text class="ml-4">
      <v-row
        no-gutters
        v-for="(item, n) in payload"
        :key="n"
      >
        <v-col cols="4">
          <div class="caption">
            Asset
          </div>
          <div class="title">
            {{ getAsset(item.assetPayload.assetId) }}
          </div>
        </v-col>
        <v-col cols="2">
          <div class="caption">
            Asset count
          </div>
          <div class="title">
            {{ item.assetPayload.records.length }}
          </div>
        </v-col>
        <v-col cols="6">
          <div class="caption">
            License key
          </div>
          <div class="title">
            {{ item.licensePayload.license }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Assets',
  async created() {
    await this.getAssets();
  },
  computed: {
    ...mapState('newCustomer', ['customerData', 'assets']),
    payload() {
      return this.customerData['2'].data;
    },
  },
  methods: {
    ...mapActions('newCustomer', ['getAssets']),
    getAsset(id) {
      return this.assets
        .find((i) => i.id === id)
        .assetDescription;
    },
  },
};
</script>
