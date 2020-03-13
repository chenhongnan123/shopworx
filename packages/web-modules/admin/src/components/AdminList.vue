<template>
  <v-list
    nav
    dense
    class="transparent"
  >
    <template v-for="(item, index) in items">
      <v-subheader
        :key="index"
        v-if="item.header"
        class="text-uppercase"
        v-text="$t(`admin.${item.header}`)"
      ></v-subheader>
      <v-list-item
        link
        v-else
        :key="index"
        :to="{ params: { id: item.to } }"
        :active-class="$vuetify.theme.dark ? 'highlighted-dark' : 'highlighted'"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="$t(`admin.items.${item.title}`)"></v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AdminList',
  computed: {
    ...mapState('admin', ['items']),
  },
  created() {
    this.redirect();
  },
  watch: {
    items() {
      this.redirect();
    },
  },
  methods: {
    redirect() {
      if (this.$route.params.id === undefined && !this.$vuetify.breakpoint.smAndDown) {
        if (this.items && this.items.length) {
          const index = this.items.findIndex((elem) => elem.title);
          const { to } = this.items.find((item, i) => index === i);
          this.$router.push({ params: { id: to } });
        }
      }
    },
  },
};
</script>

<style scoped>
.highlighted-dark {
  background-color: var(--v-primary-base);
  color: #212121
}
.highlighted {
  background-color: var(--v-primary-base);
  color: #ffffff
}
</style>
