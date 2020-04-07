<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon
          v-text="'$insights'"
        ></v-icon>
      </v-btn>
    </template>
    <span class="text-center">
      {{ $t('modules.insights') }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'InfinityInsights',
};
</script>
