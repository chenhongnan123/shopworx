<template>
  <validation-provider
    :rules="identifierValidationRules"
    :name="identifierField"
    #default="{ errors }"
  >
    <v-text-field
      required
      autofocus
      type="email"
      :prefix="prefix"
      :disabled="loading"
      v-model="identifier"
      label="Email or phone"
      autocomplete="username"
      :error-messages="errors"
      prepend-inner-icon="mdi-account-outline"
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
      return this.isMobileNumber ? 'Mobile' : 'Email';
    },
    identifierValidationRules() {
      return this.isMobileNumber ? 'required|digits:10' : 'required|email';
    },
    identifier: {
      get() {
        return this.value;
      },
      set(val) {
        /* const id = this.isMobileNumber
          ? `${this.prefix.slice(1)}${val}`
          : val; */
        this.$emit('input', val);
        this.$emit('on-update', {
          isMobile: this.isMobileNumber,
          prefix: this.prefix.slice(1),
        });
      },
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
