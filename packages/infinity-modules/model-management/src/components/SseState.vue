<template>
  <div class="float-right">
    <span class="caption">
      Event connection status:
      <v-avatar
        size="12"
        class="mb-1"
        :color="states[readyState].color"
      ></v-avatar>
      {{ states[readyState].text }}
    </span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'SseState',
  data() {
    return {
      sseClient: null,
      timeout: null,
      readyState: 0,
      states: [
        { text: 'Connecting', color: 'warning' },
        { text: 'Open', color: 'success' },
        { text: 'Closed', color: 'error' },
      ],
    };
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.sseClient.close();
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations('modelManagement', ['setLastStatusUpdate']),
    sseInit() {
      this.sseClient = new EventSource('/sse/alert');
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener('deploymodel', (e) => {
        this.readyState = e.target.readyState;
        let eventData = JSON.parse(JSON.parse(e.data));
        const {
          modelid,
          status,
        } = eventData;
        eventData = {
          key: modelid,
          status,
        };
        console.log(eventData);
        this.setLastStatusUpdate(eventData);
      });
      this.sseClient.onerror = (event) => {
        this.readyState = event.target.readyState;
        if (event.target.readyState === EventSource.CONNECTING) {
          this.sseClient.close();
          this.timeout = setTimeout(() => {
            this.sseInit();
          }, 5000);
        }
      };
    },
  },
};
</script>
