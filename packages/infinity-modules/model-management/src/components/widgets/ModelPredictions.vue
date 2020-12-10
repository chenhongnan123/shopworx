<template>
  <v-responsive :min-height="220">
    <v-card
      flat
      rounded="lg"
      outlined
      style="height:100%"
    >
      <v-card-title primary-title>
        Predictions
      <v-spacer></v-spacer>
      <v-responsive :max-width="150">
        <v-select
          dense
          filled
          hide-details
          single-line
        ></v-select>
      </v-responsive>
      </v-card-title>
    </v-card>
  </v-responsive>
</template>
