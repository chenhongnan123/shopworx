<template>
  <v-app-bar
    app
    flat
    :color="$vuetify.theme.dark ? '#121212' : 'white'"
  >
    <v-spacer></v-spacer>
    <img
      :src="require(`@shopworx/assets/logo/${shopworxLogo}.png`)"
      contain
      height="40"
    />
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AuthHeader',
  computed: {
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
