<template>
  <v-responsive :min-height="300">
    <v-card
      flat
      rounded="lg"
      outlined
      :class="$vuetify.theme.dark ? 'secondary' : 'primary'"
      dark
      style="height:100%"
    >
      <v-card-title primary-title>
        Model details
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <div>
              Station
            </div>
            <div class="title">
              Station
            </div>
          </v-col>
          <v-col cols="4">
            <div>
              Substation
            </div>
            <div class="title">
              Substation
            </div>
          </v-col>
          <v-col cols="4">
            <div>
              Subprocess
            </div>
            <div class="title warning--text">
              Subprocess
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <div>
              Last modified at
            </div>
            <div class="title">
              Last modified at
            </div>
          </v-col>
          <v-col cols="8">
            <div>
              Last status update
            </div>
            <div class="title">
              Last status update
            </div>
          </v-col>
        </v-row>
        <div class="mt-2">
          Description
        </div>
        <div class="title">
          Description
        </div>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
export default {
  name: 'ModelInfo',
};
</script>
