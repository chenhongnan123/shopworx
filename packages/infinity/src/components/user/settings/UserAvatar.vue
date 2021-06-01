<template>
  <v-row no-gutters>
    <v-col cols="4" sm="2">
      <avatar
        :name="fullName"
        :variant="currentAvatar"
        :size="96"
      />
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
import { mapGetters, mapState } from 'vuex';
import Avatar from '@shopworx/ui-components/avatars/Avatar.vue';

export default {
  name: 'UserAvatar',
  components: {
    Avatar,
  },
  computed: {
    ...mapState('helper', ['currentAvatar']),
    ...mapGetters('user', ['fullName', 'currentSite', 'customer']),
  },
};
</script>
