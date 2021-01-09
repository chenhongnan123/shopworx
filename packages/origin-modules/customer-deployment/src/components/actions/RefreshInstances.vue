<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="ml-2 mb-1"
        @click="$emit('on-refresh')"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </template>
    <span>Refresh instances</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'RefreshInstances',
};
</script>
