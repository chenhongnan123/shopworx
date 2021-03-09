<template>
  <v-responsive :min-height="250">
    <v-card
      flat
      rounded="lg"
      outlined
      :class="$vuetify.theme.dark ? 'secondary darken-2' : 'primary darken-2'"
      dark
      style="height:100%"
    >
      <v-card-title primary-title>
        Parameters
        <v-spacer></v-spacer>
        Last updated: {{ lastUpdated }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="5">
            <div>
              Velocity
            </div>
            <div
              class="font-weight-medium mt-2"
              style="font-size:32px"
              :class="v < 2 || v > 8 ? 'error--text' : 'success--text'"
            >
              {{ v }}<span class="title">cst</span>
            </div>
          </v-col>
          <v-col cols="7">
            <div>
              Specific gravity
            </div>
            <div
              class="font-weight-medium mt-2"
              style="font-size:32px"
              :class="s < 3 || s > 10 ? 'error--text' : 'success--text'"
            >
              {{ s }}
            </div>
          </v-col>
          <v-col cols="5">
            <div>
              Moisture content
            </div>
            <div
              class="font-weight-medium mt-2"
              style="font-size:32px"
              :class="m < 100 || m > 400 ? 'error--text' : 'success--text'"
            >
              {{ m }}<span class="title">PPM</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              pH
            </div>
            <div
              class="font-weight-medium mt-2"
              style="font-size:32px"
              :class="p < 5 || p > 8 ? 'error--text' : 'success--text'"
            >
              {{ p }}
            </div>
          </v-col>
          <v-col cols="4">
            <div>
              Concentration
            </div>
            <div
              class="font-weight-medium mt-2"
              style="font-size:32px"
              :class="c < 5 || c > 8 ? 'error--text' : 'success--text'"
            >
              {{ c }}<span class="title">%</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ModelInfo',
  data() {
    return {
      x: null,
      c: 0,
      p: 0,
      v: 0,
      s: 0,
      m: 0,
    };
  },
  computed: {
    ...mapState('processDashboard', ['parameters']),
    lastUpdated() {
      return this.x ? new Date(this.x).toLocaleTimeString() : '';
    },
  },
  watch: {
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
        this.x = x;
        this.c = c;
        this.p = p;
        this.v = v;
        this.s = s;
        this.m = m;
      },
    },
  },
};
</script>
