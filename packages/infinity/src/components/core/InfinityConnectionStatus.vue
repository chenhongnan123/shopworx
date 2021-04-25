<template>
  <v-system-bar
    app
    dark
    window
    v-if="!isConnected"
    :color="color"
  >
    <v-spacer></v-spacer>
    <v-icon>
      {{ icon }}
    </v-icon>
    {{ text }}
    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'InfinityConnectionStatus',
  data() {
    return {
      icon: 'mdi-wifi-strength-alert-outline',
      text: 'Cannot connect to server',
      color: 'error',
      timeout: null,
    };
  },
  computed: {
    ...mapState('helper', ['isConnected']),
  },
  methods: {
    ...mapMutations('helper', ['setIsConnected']),
    ...mapActions('helper', ['getServerTime']),
    async getConnectionStatus() {
      const success = await this.getServerTime();
      if (!this.isConnected && success) {
        this.icon = 'mdi-wifi-strength-4';
        this.text = 'Connected';
        this.color = 'success';
        setTimeout(() => {
          this.setIsConnected(true);
        }, 2000);
      } else {
        this.icon = 'mdi-wifi-strength-alert-outline';
        this.text = 'Cannot connect to server';
        this.color = 'error';
      }
      this.timeout = setTimeout(() => {
        this.getConnectionStatus();
      }, 5000);
    },
  },
  created() {
    this.timeout = setTimeout(() => {
      this.getConnectionStatus();
    }, 5000);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
};
</script>
