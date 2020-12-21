<template>
  <v-row no-gutters>
    <v-col cols="4" sm="2">
      <v-avatar
        size="96"
        color="secondary"
      >
        <v-icon
          x-large
          v-text="'$account'"
        ></v-icon>
      </v-avatar>
    </v-col>
    <v-col class="my-auto">
      <div class="display-1 font-weight-medium">
        {{ fullName }}
      </div>
      <div class="title">
        {{ customer }}, {{ currentSite }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserAvatar',
  computed: {
    ...mapGetters('user', ['fullName', 'currentSite', 'customer']),
  },
};
</script>
