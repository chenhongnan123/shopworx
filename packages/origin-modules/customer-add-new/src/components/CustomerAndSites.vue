<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <v-card flat class="transparent" fill-height>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <perfect-scrollbar>
        <v-card-text style="max-height: calc(100vh - 156px);">
          <div class="title">Customer details</div>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Customer name"
                v-model="customerDescription"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                :items="industries"
                label="Industry"
                item-text="industryDescription"
                item-value="id"
                v-model="industryId"
                :rules="requiredRule"
                :disabled="loading"
              ></v-select>
            </v-col>
          </v-row>
          <div class="title">Site details</div>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Contact name"
                v-model="contactName"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Contact number"
                prefix="+91"
                v-model="contactNumber"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            label="Address"
            v-model="addressLine1"
            :rules="requiredRule"
            :disabled="loading"
          ></v-text-field>
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="Area"
                v-model="area"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="City"
                v-model="city"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="State"
                v-model="state"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Pincode"
                v-model="pinCode"
                :rules="requiredRule"
                :disabled="loading"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          block
          :disabled="!isValid"
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
  name: 'CustomerAndSites',
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
      customerDescription: '',
      industryId: '',
      addressLine1: '',
      area: '',
      city: '',
      state: '',
      pinCode: '',
      contactNumber: '',
      contactName: '',
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  async created() {
    this.loading = true;
    await this.getIndustries();
    if (this.info.data) {
      this.setDetails();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('newCustomer', ['industries', 'customerData']),
  },
  methods: {
    ...mapActions('newCustomer', ['getIndustries']),
    ...mapMutations('newCustomer', ['updateCustomerData', 'setSelectedIndustry']),
    getName(description) {
      return description
        ? description
          .toLowerCase()
          .replace(/\W/g, '')
          .replace(/-/g, '')
          .replace(/_/g, '')
          .split(' ')
          .join('')
        : '';
    },
    setDetails() {
      const { customerPayload, sitePayload } = this.info.data;
      const {
        customerDescription,
        industryId,
      } = customerPayload;
      const {
        siteDescription,
        addressLine1,
        contactName,
        contactNumber,
        area,
        city,
        state,
        pinCode,
      } = sitePayload;
      this.customerDescription = customerDescription;
      this.industryId = industryId;
      this.siteDescription = siteDescription;
      this.addressLine1 = addressLine1;
      this.area = area;
      this.city = city;
      this.state = state;
      this.pinCode = pinCode;
      this.contactNumber = contactNumber;
      this.contactName = contactName;
      this.setSelectedIndustry(industryId);
    },
    save() {
      const {
        customerDescription,
        industryId,
        addressLine1,
        contactName,
        contactNumber,
        area,
        city,
        state,
        pinCode,
      } = this;
      const customerPayload = {
        customerName: this.getName(customerDescription),
        customerDescription,
        industryId,
        status: 'ACTIVE',
      };
      const sitePayload = {
        customerId: '',
        siteName: this.getName(city),
        siteDescription: city,
        contactName,
        contactNumber,
        addressLine1,
        addressLine2: '',
        addressLine3: '',
        area,
        city,
        state,
        pinCode,
        country: 'INDIA',
        iconUrl: '',
        x: '',
        y: '',
      };
      const data = {
        key: 1,
        data: {
          customerPayload,
          sitePayload,
        },
        isComplete: true,
      };
      this.updateCustomerData(data);
      localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
      this.setSelectedIndustry(industryId);
      this.$router.push({ params: { id: 2 } });
    },
  },
};
</script>
