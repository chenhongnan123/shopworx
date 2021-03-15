<template>
  <v-form ref="form" v-model="isValid" @submit.prevent="save">
    <v-card flat class="transparent" fill-height>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <perfect-scrollbar>
        <v-card-text style="max-height: calc(100vh - 156px);">
          <div>Roles</div>
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
  name: 'RolesAndAccess',
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
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  async created() {
    this.loading = true;
    await this.getAssets();
    if (this.info.data) {
      this.setDetails();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('newCustomer', ['assets', 'customerData']),
  },
  methods: {
    ...mapActions('newCustomer', ['getAssets']),
    ...mapMutations('newCustomer', ['updateCustomerData']),
    setDetails() {},
    save() {
      const data = {
        key: 3,
        data: null,
        status: 'complete',
      };
      this.updateCustomerData(data);
      localStorage.setItem('new-customer-data', JSON.stringify(this.customerData));
      this.$router.push({ params: { id: 4 } });
    },
  },
};
</script>
