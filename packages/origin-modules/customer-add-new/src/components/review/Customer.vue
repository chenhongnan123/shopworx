<template>
  <v-card flat v-if="!waiting && payload">
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="4">
          <div class="caption">
            Customer name
          </div>
          <div class="title">
            {{ payload.customerDescription }}
          </div>
        </v-col>
        <v-col cols="8">
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Customer',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      waiting: false,
    };
  },
  async created() {
    this.waiting = true;
    if (this.payload) {
      this.setSelectedIndustry(this.payload.industryId);
    }
    await this.getIndustries();
    this.waiting = false;
  },
  computed: {
    ...mapState('newCustomer', ['customerData', 'industries']),
    payload() {
      return this.customerData['1'].data && this.customerData['1'].data.customerPayload;
    },
  },
  methods: {
    ...mapMutations('newCustomer', ['setSelectedIndustry']),
    ...mapActions('newCustomer', ['getIndustries']),
    getIndustry() {
      return this.industries
        .find((i) => i.id === this.payload.industryId)
        .industryDescription;
    },
  },
  watch: {
    loading(val) {
      if (val) {
        console.log('customer');
        setTimeout(() => {
          this.$emit('on-complete');
        }, 3000);
      }
    },
  },
};
</script>
