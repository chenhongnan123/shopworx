<template>
  <v-card flat v-if="payload">
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="6">
          <div class="caption">
            Customer name
          </div>
          <div class="title">
            {{ payload.customerDescription }}
          </div>
        </v-col>
        <v-col cols="6">
          <div class="caption">
            Industry
          </div>
          <div class="title">
            {{ getIndustry() }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Customer',
  async created() {
    await this.getIndustries();
  },
  computed: {
    ...mapState('newCustomer', ['customerData', 'industries']),
    payload() {
      return this.customerData['1'].data && this.customerData['1'].data.customerPayload;
    },
  },
  methods: {
    ...mapActions('newCustomer', ['getIndustries']),
    getIndustry() {
      console.log(this.industries);
      return this.industries
        .find((i) => i.id === this.payload.industryId)
        .industryDescription;
    },
  },
};
</script>
