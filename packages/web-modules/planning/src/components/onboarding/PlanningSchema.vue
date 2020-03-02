<template>
  <v-card flat>
    <p
      class="text-center primary--text display-1 font-weight-medium my-2"
      v-text="$t('infinity.planning.onboarding.schema.title')"
    ></p>
    <v-card-text>
      <div class="title mt-2">
        How do you plan on your injection moulding machines?
      </div>
      <v-checkbox hide-details label="Machine" value="value"></v-checkbox>
      <v-checkbox hide-details label="Tool" value="value"></v-checkbox>
      <v-checkbox hide-details label="Part" value="value"></v-checkbox>
      <div class="title mt-4">
        How do you plan on your press machines?
      </div>
      <v-checkbox hide-details label="Machine" value="value"></v-checkbox>
      <v-checkbox hide-details label="Tool" value="value"></v-checkbox>
      <v-checkbox hide-details label="Part" value="value"></v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PlanningSchema',
};
</script>
