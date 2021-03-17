<template>
  <div class="d-flex align-center">
    <div class="d-flex mr-2">
      <v-menu v-if="prefix">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            style="margin-right: 2px;"
          >
            <img :src="`/flag/${flag}.svg`" width="22" />
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="(country, i) in countries"
            :key="i"
            @click="onSelectFlag(country)"
          >
            <v-list-item-title class="d-flex">
              <img :src="`/flag/${country.flag}.svg`" width="22" class="mr-2"/>
              <span>{{ country.name }} ({{ country.code }})</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span v-if="!prefix">
        <v-icon>
        {{'$identifier'}}
      </v-icon>
      </span>
    </div>

    <v-text-field
      :id="id"
      autofocus
      type="email"
      :prefix="prefix"
      :disabled="loading"
      v-model="identifier"
      autocomplete="username"
      :error-messages="errorMsg"
      :label="$t('login.identifier')"
      :rules="identifierValidationRules"
      ref="username"
    ></v-text-field>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'IdentifierInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: 'identifier',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
    },
  },
  data() {
    return {
      showFlags: false,
      flag: 'IN',
      countryCode: '+91',
      errorMsg: '',
      countries: [
        {
          name: 'India',
          flag: 'IN',
          code: '+91',
        },
        {
          name: 'China',
          flag: 'CN',
          code: '+86',
        },
        {
          name: 'Thailand',
          flag: 'TH',
          code: '+66',
        },
        {
          name: 'Germany',
          flag: 'DE',
          code: '+49',
        },
      ],
    };
  },
  computed: {
    isMobileNumber() {
      return this.isNumberic(this.identifier);
    },
    prefix() {
      return this.isMobileNumber ? this.countryCode : '';
    },
    identifierField() {
      return this.isMobileNumber
        ? 'phone'
        : 'email';
    },
    identifierValidationRules() {
      if (this.isMobileNumber) {
        if (this.countryCode === '+91') {
          return [
            v => !!v || 'Phone is required',
            v => /^[7-9][0-9]{9}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.countryCode === '+86') {
          return [
            v => !!v || 'Phone is required',
            v => /^1[0-9]{10}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.countryCode === '+66') {
          return [
            v => !!v || 'Phone is required',
            v => /^[6,8,9][0-9]{8}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.countryCode === '+49') {
          return [
            v => !!v || 'Phone is required',
            v => /^1[0-9]{9,10}$/.test(v) || 'Phone must be valid',
          ];
        }
      } else {
        return [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ];
      }
    },
    identifier: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  watch: {
    identifier() {
      this.$emit('on-update', {
        isMobile: this.isMobileNumber,
        prefix: this.prefix.slice(1),
      });
      this.errorMsg = '';
    },
    error() {
      this.errorMsg = this.error;
    }
  },
  methods: {
    isNumberic(candidate) {
      if (typeof (candidate) === 'number') return Number.isFinite(candidate);
      if (typeof (candidate) === 'string') {
        return (candidate.trim() !== '') && Number.isFinite(Number(candidate));
      }
      return false;
    },
    setFlag(country) {
      this.flag = country.flag;
      this.countryCode = country.code;
    },
    async onSelectFlag(country) {
      await this.setFlag(country);
      this.$refs.username.validate();
      this.$emit('on-update', {
        isMobile: this.isMobileNumber,
        prefix: this.prefix.slice(1),
      });
    }
  },
};
</script>
