<template>
  <v-responsive :min-height="300">
    <v-card
      flat
      rounded="lg"
      outlined
      style="height:100%"
    >
      <v-card-title primary-title>
        Features
      <v-spacer></v-spacer>
      <v-responsive :max-width="150">
        <v-select
          dense
          filled
          hide-details
          single-line
          class="mr-2"
        ></v-select>
      </v-responsive>
      <v-responsive :max-width="150">
        <v-select
          dense
          filled
          class="ml-2"
          hide-details
          single-line
        ></v-select>
      </v-responsive>
      </v-card-title>
    </v-card>
  </v-responsive>
</template>
