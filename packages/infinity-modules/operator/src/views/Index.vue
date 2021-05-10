<template>
  <div style="height: 100%">
    <template>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
export default {
  name: 'OperatorIndex',
};
</script>
