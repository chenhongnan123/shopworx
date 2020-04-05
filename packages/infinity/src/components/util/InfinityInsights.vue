<template>
  <v-btn
    text
    color="primary"
    class="text-none"
  >
    <v-icon v-text="'$insights'" left></v-icon>
    {{ $t('modules.insights') }}
  </v-btn>
</template>

<script>
export default {
  name: 'InfinityInsights',
};
</script>
