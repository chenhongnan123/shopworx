<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'mdi-download-outline'"
          ></v-icon>
        Download CSV template
        </v-btn>
      </span>
    </portal>
    <v-responsive :max-width="400">
      <v-file-input
        filled
        hide-details
        single-line
        label="Select file from your computer"
        prepend-inner-icon="mdi-upload-outline"
        prepend-icon=""
      ></v-file-input>
    </v-responsive>
    <div class="caption">
      You can import plans in CSV format.
    </div>
    <v-btn
      class="text-none mt-8"
      color="primary"
      disabled
    >
      Import
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ImportPlans',
  data() {
    return {};
  },
};
</script>
