<template>
  <v-responsive
    class="transition-swing"
    :max-width="isFocused ? 360 : 180"
  >
    <v-text-field
      flat
      dense
      rounded
      outlined
      id="search"
      single-line
      ref="search"
      class="mr-2"
      hide-details
      label="Search"
      @blur="onBlur"
      v-model="search"
      @focus="onFocus"
      autocomplete="off"
      @keydown.esc="onEsc"
    >
      <template #prepend-inner>
        <v-icon v-text="'$search'"></v-icon>
      </template>
    </v-text-field>
  </v-responsive>
</template>

<script>
export default {
  name: 'InfinitySearch',
  data() {
    return {
      search: '',
      timeout: null,
      isFocused: false,
      isSearching: false,
    };
  },
  mounted() {
    document.onkeydown = (event) => {
      const e = event || window.event;
      if (e.key === '/' && e.target !== this.$refs.search.$refs.input) {
        e.preventDefault();
        this.$refs.search.focus();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    onBlur() {
      this.resetSearch();
    },
    onEsc() {
      this.$refs.search.blur();
    },
    onFocus() {
      clearTimeout(this.timeout);
      this.isFocused = true;
    },
    resetSearch(timeout = 0) {
      clearTimeout(this.timeout);
      this.$nextTick(() => {
        this.search = undefined;
        this.isSearching = false;
        this.timeout = setTimeout(() => {
          this.isFocused = false;
        }, timeout);
      });
    },
  },
};
</script>
