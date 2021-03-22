<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <div
        v-on="on"
        v-bind="attrs"
        :style="styles"
      >
        <img :src="require(`@shopworx/assets/flags/${flag}.svg`)" width="22" />
      </div>
    </template>
    <v-list>
      <v-list-item
        v-for="(country, i) in countries"
        :key="i"
        @click="onSelectFlag(country)"
      >
        <v-list-item-title class="d-flex">
          <img
            :src="require(`@shopworx/assets/flags/${country.flag}.svg`)"
            width="22"
            class="mr-2"
          />
          <span>{{ country.name }} ({{ country.code }})</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    countryCode: {
      type: String,
    },
    styles: {
      type: String,
    }
  },
  data() {
    return {
      flag: 'IN',
      countries: [
        {
          name: "India",
          flag: "IN",
          code: "+91",
        },
        {
          name: "China",
          flag: "CN",
          code: "+86",
        },
        {
          name: "Thailand",
          flag: "TH",
          code: "+66",
        },
        {
          name: "Germany",
          flag: "DE",
          code: "+49",
        },
      ],
    };
  },
  mounted() {
    this.flag = this.countries.find(country => country.code === this.countryCode).flag;
  },
  methods: {
    onSelectFlag(country) {
      this.$emit('on-select', country);
      this.flag = country.flag;
    },
  },
};
</script>
