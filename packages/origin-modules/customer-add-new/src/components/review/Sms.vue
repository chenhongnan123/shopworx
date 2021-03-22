<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="6">
          <div class="caption">
            SMS provider
          </div>
          <div class="title">
            {{ sms.smsProviderDescription }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import sms from '../../data/smsPayload';

export default {
  name: 'Sms',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sms,
    };
  },
  methods: {
    ...mapActions('newCustomer', ['addSmsProvider']),
  },
  watch: {
    async loading(val) {
      if (val) {
        const created = await this.addSmsProvider(this.sms);
        if (created) {
          this.$emit('on-complete');
        }
      }
    },
  },
};
</script>
