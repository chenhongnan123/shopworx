<template>
  <v-btn-toggle
    dense
    mandatory
    multiple
    color="primary"
    v-model="workingDays"
  >
    <v-btn class="text-none">
      S
    </v-btn>
    <v-btn class="text-none">
      M
    </v-btn>
    <v-btn class="text-none">
      T
    </v-btn>
    <v-btn class="text-none">
      W
    </v-btn>
    <v-btn class="text-none">
      T
    </v-btn>
    <v-btn class="text-none">
      F
    </v-btn>
    <v-btn class="text-none">
      S
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'BusinessWorkingDays',
  data() {
    return {
      workingDays: [1, 2, 3, 4, 5],
    };
  },
};
</script>
