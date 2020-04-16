<template>
  <v-container fluid class="py-0" style="height:100%">
    <v-row justify="center" style="height:100%">
      <v-col cols="12" xl="10" class="py-0" style="height:90%">
        <v-toolbar
          flat
          dense
          :color="$vuetify.theme.dark ? '#121212': ''"
          :class="$vuetify.breakpoint.mdAndUp
            ? 'stick'
            : 'stick-mobile'"
        >
          <v-btn small color="primary" class="text-none">
            <v-icon small left>mdi-plus</v-icon>
            Add plan
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2">
            <v-icon small left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn small outlined class="text-none">
            Today
          </v-btn>
          <v-btn small icon class="ml-2">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn small icon class="ml-2">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <span class="mx-4">April 2020</span>
          <v-btn small outlined class="text-none ml-2">
            Month
            <v-icon small right>mdi-chevron-down</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn small color="primary" outlined class="text-none" @click="drawer = true">
            <v-icon small left>mdi-filter-variant</v-icon>
            Filters
          </v-btn>
        </v-toolbar>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="[]"
          type="month"
        ></v-calendar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PlanCalendarView',
};
</script>
