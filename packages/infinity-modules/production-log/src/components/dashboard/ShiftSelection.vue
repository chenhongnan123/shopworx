<template>
  <v-btn
    small
    outlined
    color="primary"
    class="text-none ml-2"
  >
    <v-icon small left v-text="'$shiftHours'"></v-icon>
    Shift
    <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'ShiftSelection',
};
</script>
