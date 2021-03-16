<template>
  <v-card flat v-if="payload">
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="6">
          <div class="caption">
            SMS provider
          </div>
          <div class="title">
            {{ payload.smsProviderDescription }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Sms',
  data() {
    return {
      payload: {
        smsProviderName: 'msg91',
        smsProviderDescription: 'MSG91',
        smsProviderUrl: 'http://api.msg91.com/api/sendhttp.php',
        smsPrimary: true,
        smsProviderMessageText: 'message',
        smsProviderDestinationText: 'mobiles',
        countryCodeRequired: false,
        status: 'ACTIVE',
        errorList: `Demo account,IP not whitelisted,Missing mobile no.,
        Missing message,Missing sender ID,Missing password,
        Missing Authentication Key,Missing Route,Invalid mobile number. 
        You must have entered either less than 10 digits or there is an 
        alphabetic character in the mobile number field in API.,Invalid 
        sender ID. Your sender ID must be 6 characters,alphabetic.,
        Invalid authentication key. Crosscheck your authentication key 
        from your account’s API section.,IP is blacklisted. We are getting 
        SMS submission requests other than your whitelisted IP list.,
        Insufficient balance to send SMS,Expired user account. You need 
        to contact your account manager.,Banned user account,This route 
        is currently unavailable. You can send SMS from this route only 
        between 9 AM - 9 PM.,Incorrect scheduled time,Campaign name cannot 
        be greater than 32 characters,Selected group(s) does not belong 
        to you,SMS is too long. System paused this request automatically.,
        Request discarded because same request was generated twice within 
        10 seconds,Some Parameter are missing`,
        smsProviderSetting: [
          {
            smsFieldName: 'authkey',
            smsFieldValue: '337247AkdRyfkWt5f2115d5P1',
            smsFieldDescription: 'Your Auth Key',
          },
          {
            smsFieldName: 'country',
            smsFieldValue: '91',
            smsFieldDescription: 'Country code',
          },
          {
            smsFieldName: 'sender',
            smsFieldValue: 'SHPWRX',
            smsFieldDescription: 'Approved sender id(Only 6 characters).',
          },
          {
            smsFieldName: 'route',
            smsFieldValue: '4',
            smsFieldDescription: 'Route code',
          },
        ],
        smsTemplates: [
          'Hello! This is a test message',
        ],
      },
    };
  },
  async created() {
    await this.getIndustries();
  },
  computed: {
    ...mapState('newCustomer', ['customerData', 'industries']),
  },
  methods: {
    ...mapActions('newCustomer', ['getIndustries']),
    getIndustry() {
      return this.industries
        .find((i) => i.id === this.payload.industryId)
        .industryDescription;
    },
  },
};
</script>
