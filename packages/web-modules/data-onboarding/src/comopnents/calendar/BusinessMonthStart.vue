<template>
  <v-btn-toggle
    dense
    mandatory
    v-model="yearStart"
    color="primary"
  >
    <v-btn class="text-none">
      Jan
    </v-btn>
    <v-btn class="text-none">
      Feb
    </v-btn>
    <v-btn class="text-none">
      Mar
    </v-btn>
    <v-btn class="text-none">
      Apr
    </v-btn>
    <v-btn class="text-none">
      May
    </v-btn>
    <v-btn class="text-none">
      Jun
    </v-btn>
    <v-btn class="text-none">
      Jul
    </v-btn>
    <v-btn class="text-none">
      Aug
    </v-btn>
    <v-btn class="text-none">
      Sep
    </v-btn>
    <v-btn class="text-none">
      Oct
    </v-btn>
    <v-btn class="text-none">
      Nov
    </v-btn>
    <v-btn class="text-none">
      Dec
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'BusinessStartMonth',
  data() {
    return {
      yearStart: 0,
    };
  },
};
</script>
