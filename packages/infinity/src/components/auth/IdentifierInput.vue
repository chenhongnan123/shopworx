<template>
  <div class="d-flex align-center">
    <div class="d-flex mr-2">
      <country-selection
        v-if="prefix"
        :countryCode="prefix"
        @on-select="onSelectFlag"
        styles="margin-right: 2px; margin-top: 4px;"
      />
      <span v-else>
        <v-icon>
          {{'$identifier'}}
        </v-icon>
      </span>
    </div>

    <v-text-field
      :id="id"
      autofocus
      type="email"
      ref="username"
      :prefix="prefix"
      :disabled="loading"
      v-model="identifier"
      autocomplete="username"
      :error-messages="errorMsg"
      :label="$t('login.identifier')"
      :rules="identifierValidationRules"
    ></v-text-field>
  </div>
</template>

<script>
import CountrySelection from '@/components/auth/CountrySelection.vue';
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
  components: {
    CountrySelection
  },
  data() {
    return {
      errorMsg: '',
      countryCode: '+91',
    };
  },
  mounted() {
    const username = localStorage.getItem('username');
    if (username) {
      this.identifier = username;
    }
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
            v => !!v || this.$t('auth.phoneRequired'),
            v => /^[7-9][0-9]{9}$/.test(v) || this.$t('auth.phoneInvalid'),
          ];
        }
        if (this.countryCode === '+86') {
          return [
            v => !!v || this.$t('auth.phoneRequired'),
            v => /^1[0-9]{10}$/.test(v) || this.$t('auth.phoneInvalid'),
          ];
        }
        if (this.countryCode === '+66') {
          return [
            v => !!v || this.$t('auth.phoneRequired'),
            v => /^[6,8,9][0-9]{8}$/.test(v) || this.$t('auth.phoneInvalid'),
          ];
        }
        if (this.countryCode === '+49') {
          return [
            v => !!v || this.$t('auth.phoneRequired'),
            v => /^1[0-9]{9,10}$/.test(v) || this.$t('auth.phoneInvalid'),
          ];
        }
      } else {
        return [
          v => !!v || this.$t('auth.emailRequired'),
          v => /.+@.+\..+/.test(v) || this.$t('auth.emailInvalid'),
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
    onSelectFlag(country) {
      this.countryCode = country.code;
      this.$nextTick(() => {
        this.$refs.username.validate();
        this.$emit('on-update', {
          isMobile: this.isMobileNumber,
          prefix: this.prefix.slice(1),
        });
      });
    },
  },
};
</script>
