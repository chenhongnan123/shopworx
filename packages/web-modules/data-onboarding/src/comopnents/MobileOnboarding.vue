<template>
  <v-card flat class="transparent">
    <v-card-text class="text-center">
      <v-row align="center" no-gutters>
        <v-col>
          <div>
            <v-icon
              size="96"
              v-text="'mdi-database'"
            ></v-icon>
          </div>
          <div
            class="title font-weight-regular"
            v-text="'Onboarding unavilable'"
          ></div>
          <span
            class="mt-2"
            v-text="'Please open on Desktop to continue'"
          ></span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MobileOnboarding',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
