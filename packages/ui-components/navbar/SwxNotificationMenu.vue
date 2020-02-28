<template>
  <v-btn
    icon
    disabled
    class="buttonClass"
  >
    <v-badge
      overlap
      color="primary"
      v-model="showBadge"
      class="align-self-center"
    >
      <template v-slot:badge>
        <span
          :class="{'black--text': $vuetify.theme.dark}"
          v-text="1"
        >
        </span>
      </template>
      <v-icon v-text="'$notifications'"></v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
export default {
  name: 'SwxNotificationMenu',
  props: {
    buttonClass: {
      type: String,
      default: 'px-8',
    },
  },
  data() {
    return {
      showBadge: false,
    };
  },
};
</script>
