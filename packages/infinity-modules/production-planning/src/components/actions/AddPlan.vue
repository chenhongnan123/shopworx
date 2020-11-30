<template>
  <v-form>
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              name="name"
              label="Part"
              id="id"
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              name="name"
              label="Machine"
              id="id"
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              name="name"
              label="Equipment"
              id="id"
              filled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: 'AddPlan',
};
</script>
