<template>
  <validation-provider
    :rules="identifierValidationRules"
    :name="identifierField"
    #default="{ errors }"
  >
    <v-text-field
      autofocus
      id="email"
      type="email"
      :prefix="prefix"
      :disabled="loading"
      v-model="identifier"
      autocomplete="username"
      :error-messages="errors"
      :label="$t('login.identifier')"
      prepend-inner-icon="$identifier"
    ></v-text-field>
  </validation-provider>
</template>

<script>
export default {
  name: 'IdentifierInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isMobileNumber() {
      return this.isNumberic(this.identifier);
    },
    prefix() {
      return this.isMobileNumber ? '+91' : '';
    },
    identifierField() {
      return this.isMobileNumber
        ? this.$i18n.t('fields.phone')
        : this.$i18n.t('fields.email');
    },
    identifierValidationRules() {
      return this.isMobileNumber ? 'required|phone:10' : 'required|email';
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
    },
  },
  methods: {
    isNumberic(candidate) {
      if (typeof (candidate) === 'number') return Number.isFinite(candidate);
      if (typeof (candidate) === 'string') {
        return (candidate.trim() !== '') && Number.isFinite(Number(candidate));
      }
      return false;
    },
  },
};
</script>
