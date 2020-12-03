<template>
  <v-row>
    <v-col v-for="n in 4" :key="n" cols="3">
      <v-responsive max-height="80" min-height="80">
        <v-card
          flat
          outlined
          class="flex text-center"
          height="100%"
          rounded="lg"
        >
          <div class="display-1 mt-2">
            4
          </div>
          <div class="title">
            Operating
          </div>
        </v-card>
      </v-responsive>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NonTvToolbar',
};
</script>
