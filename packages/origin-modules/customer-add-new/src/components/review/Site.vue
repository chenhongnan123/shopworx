<template>
  <v-card flat v-if="payload">
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="4">
          <div class="caption">
            Site name
          </div>
          <div class="title">
            {{ payload.siteDescription }}
          </div>
        </v-col>
        <v-col cols="8">
          <div class="caption">
            Address
          </div>
          <div class="title">
            {{ payload.addressLine1 }}
          </div>
        </v-col>
        <v-col cols="4">
          <div class="caption">
            Area, City
          </div>
          <div class="title">
            {{ payload.area }}, {{ payload.city }}
          </div>
        </v-col>
        <v-col cols="4">
          <div class="caption">
            State
          </div>
          <div class="title">
            {{ payload.state }}
          </div>
        </v-col>
        <v-col cols="4">
          <div class="caption">
            Pincode
          </div>
          <div class="title">
            {{ payload.pinCode }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Site',
  computed: {
    ...mapState('newCustomer', ['customerData']),
    payload() {
      return this.customerData['1'].data && this.customerData['1'].data.sitePayload;
    },
  },
};
</script>
