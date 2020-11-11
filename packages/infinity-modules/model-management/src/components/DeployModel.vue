<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="success"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-rocket-outline</v-icon>
      </v-btn>
    </template>
    <span>Deploy model</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DeployModel',
};
</script>
