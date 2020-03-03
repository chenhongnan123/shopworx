<template>
  <div>
    Masters
    {{formattedElements}}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Masters',
  async created() {
    await this.getElements();
  },
  computed: {
    ...mapGetters('masters', ['formattedElements']),
  },
  methods: {
    ...mapActions('masters', ['getElements']),
  },
};
</script>
