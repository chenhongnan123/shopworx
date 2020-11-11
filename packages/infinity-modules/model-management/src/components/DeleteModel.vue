<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="error"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </template>
    <span>Delete model</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DeleteModel',
};
</script>
