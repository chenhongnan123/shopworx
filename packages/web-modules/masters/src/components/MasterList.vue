<template>
  <v-list
    nav
    dense
  >
    <template v-for="(item, index) in formattedElements">
      <v-subheader
        :key="index"
        v-if="item.header"
        class="text-uppercase"
        v-text="$t(`masters.categories.${item.header}`)"
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
        <v-list-item-title v-text="$t(`masters.elements.${item.title}`)"></v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MasterList',
  computed: {
    ...mapGetters('masters', ['formattedElements']),
  },
  created() {
    this.redirect();
  },
  watch: {
    formattedElements() {
      this.redirect();
    },
  },
  methods: {
    redirect() {
      if (this.$route.params.id === undefined && !this.$vuetify.breakpoint.smAndDown) {
        if (this.formattedElements && this.formattedElements.length) {
          const index = this.formattedElements.findIndex((elem) => elem.title);
          const { to } = this.formattedElements.find((item, i) => index === i);
          this.$router.push({ params: { id: to } });
        }
      }
    },
  },
};
</script>
