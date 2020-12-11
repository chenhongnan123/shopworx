<template>
  <v-responsive :min-height="220">
    <v-card flat rounded="lg" style="height: 100%">
      <v-card-title primary-title> Alerts </v-card-title>
      <v-card-text>
        <v-timeline dense>
          <v-slide-x-reverse-transition group hide-on-leave>
            <v-timeline-item
              v-for="item in items"
              :key="item.id"
              :color="item.color"
              small
              fill-dot
            >
              <v-alert
                :value="true"
                :color="item.color"
                :icon="item.icon"
                class="white--text"
              >
                Overheating Detected: T530310200990948 is 0.000 % is a probable
                bad part produced at Thu Dec 10 2020 20:02:40 GMT+0800 (CST)
              </v-alert>
            </v-timeline-item>
          </v-slide-x-reverse-transition>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
const COLORS = ['info', 'warning', 'error'];
const ICONS = {
  info: 'mdi-information',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle',
};
export default {
  name: 'ModelWarnings',
  data() {
    return {
      interval: null,
      items: [
        {
          id: 1,
          color: 'info',
          icon: ICONS.info,
        },
      ],
      nonce: 2,
    };
  },
  beforeDestroy() {
    this.stop();
  },
  created() {
    this.start();
  },
  methods: {
    addEvent() {
      let { color } = this.genAlert();
      const { icon } = this.genAlert();

      const previousColor = this.items[0].color;

      while (previousColor === color) {
        color = this.genColor();
      }

      this.items.unshift({
        id: (this.nonce += 1),
        color,
        icon,
      });

      if (this.nonce > 3) {
        this.items.pop();
      }
    },
    genAlert() {
      const color = this.genColor();

      return {
        color,
        icon: this.genIcon(color),
      };
    },
    genColor() {
      return COLORS[Math.floor(Math.random() * 3)];
    },
    genIcon(color) {
      return ICONS[color];
    },
    start() {
      this.interval = setInterval(this.addEvent, 5000);
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    },
  },
};
</script>
