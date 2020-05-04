<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <v-toolbar
          flat
          dense
          class="stick"
          :color="$vuetify.theme.dark ? '#121212': ''"
        >
          <v-spacer></v-spacer>
          <v-btn small color="primary" class="text-none">
            <v-icon small left>mdi-plus</v-icon>
            Add plan
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2">
            <v-icon small left v-text="'$production'"></v-icon>
            Machine
            <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="drawer = true">
            <v-icon small left>mdi-filter-variant</v-icon>
            Filters
          </v-btn>
        </v-toolbar>
        <div class="title pl-2 card-border">Now</div>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <div class="title pl-2 mt-4 card-border">Today - April 9th</div>
        <v-card flat class="mt-4 ml-2 mr-2" style="z-index:0">
          No plans
        </v-card>
        <div class="title pl-2 mt-4 card-border">This week</div>
        <v-card flat class="mt-4 ml-2 mr-2" style="z-index:0">
          No plans
        </v-card>
        <div class="title pl-2 mt-4 card-border">Next week</div>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <div class="title pl-2 mt-4 card-border">Later this month</div>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
        <v-card outlined class="mt-4 ml-2 mr-2" style="z-index:0">
          <v-card-title>
            Plan 101-3245
          </v-card-title>
          <v-card-text>
            Machine 1
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PlanScheduleView',
  data() {
    return {
      drawer: true,
    };
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
.card-border {
  border-left: 4px solid green;
}
</style>
