<template>
  <v-responsive :min-height="220">
    <v-card flat rounded="lg" style="height: 100%">
      <v-card-title primary-title>
        Alerts
        <v-spacer></v-spacer>
        <span>
          <v-btn
            small
            color="error"
            icon
            v-if="configDrawer"
            @click="$emit('remove-widget', widget.i)"
          >
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
        </span>
      </v-card-title>
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
                v-html="item.text"
              ></v-alert>
            </v-timeline-item>
          </v-slide-x-reverse-transition>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
import { mapState } from 'vuex';

const COLORS = ['info', 'warning', 'error'];
const ICONS = {
  info: 'mdi-information',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle',
};
export default {
  name: 'ModelWarnings',
  props: {
    widget: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      items: [],
      nonce: 1,
    };
  },
  computed: {
    ...mapState('processDashboard', ['parameters']),
    ...mapState('helper', ['configDrawer']),
  },
  watch: {
    chartType(val) {
      this.options.chart.type = val;
    },
    parameters: {
      deep: true,
      handler(val) {
        const {
          x,
          c,
          p,
          v,
          s,
          m,
        } = val;
        if (v < 2 || v > 8) {
          this.addEvent({
            text: `<b>Velocity</b> out of range: <b>${v}</b> cst at ${new Date(x)}`,
            color: v < 2 ? 'warning' : 'error',
          });
        } else if (s < 3 || s > 10) {
          this.addEvent({
            text: `<b>Specific gravity</b> out of range: <b>${s}</b> at ${new Date(x)}`,
            color: s < 3 ? 'warning' : 'error',
          });
        } else if (m < 100 || m > 400) {
          this.addEvent({
            text: `<b>Moisture content</b> out of range: <b>${m}</b> PPM at ${new Date(x)}`,
            color: m < 100 ? 'warning' : 'error',
          });
        }
        if (c < 5 || c > 8) {
          this.addEvent({
            text: `<b>Concentration</b> out of range: <b>${c}</b>% at ${new Date(x)}`,
            color: c < 5 ? 'info' : 'warning',
          });
        } else if (p < 5 || p > 8) {
          this.addEvent({
            text: `<b>pH</b> out of range: <b>${p}</b> at ${new Date(x)}`,
            color: p < 5 ? 'info' : 'warning',
          });
        }
      },
    },
  },
  methods: {
    addEvent({
      text,
      color,
    }) {
      const { icon } = this.genAlert();

      this.items.unshift({
        id: (this.nonce += 1),
        color,
        icon,
        text,
      });

      if (this.nonce > 4) {
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
  },
};
</script>
