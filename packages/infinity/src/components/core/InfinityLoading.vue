<template>
  <v-content :class="$vuetify.theme.dark ? '#121212' : 'white'">
    <auth-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="72"
        ></v-progress-circular>
        <span class="display-3">
          {{ $t('helper.loading') }}
        </span>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import AuthHeader from '@/components/auth/AuthHeader.vue';

export default {
  name: 'InfinityLoading',
  components: {
    AuthHeader,
  },
};
</script>
