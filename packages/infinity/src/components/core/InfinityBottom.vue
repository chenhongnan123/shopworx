<template>
  <v-bottom-navigation
    app
    grow
    color="primary"
    v-model="bottomNav"
  >
    <v-btn value="home">
      <span>Home</span>
      <v-icon v-text="'$home'"></v-icon>
    </v-btn>
    <v-btn value="search">
      <span>Search</span>
      <v-icon v-text="'$search'"></v-icon>
    </v-btn>
    <v-btn value="insights">
      <span>Insights</span>
      <v-icon v-text="'$insights'"></v-icon>
    </v-btn>
    <v-btn value="profile">
      <span>Profile</span>
      <v-icon v-text="'$account'"></v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'InfinityBottom',
  data() {
    return {
      bottomNav: false,
    };
  },
};
</script>
