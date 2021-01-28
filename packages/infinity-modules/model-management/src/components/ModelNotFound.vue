<template>
  <v-container fill-height>
    <v-row
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndDown"
    >
      <v-col cols="5" align="center">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" align="center">
        <span class="headline">
          {{ id }} not found
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ModelNotFound',
  computed: {
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    addNew() {
      this.$router.push({ name: 'modelManagement' });
    },
  },
};
</script>
