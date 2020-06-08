<template>
  <div>
    <span
      class="title font-weight-regular"
      v-if="title"
      v-text="title"
    ></span>
    <span class="float-right">
      <v-btn
        small
        color="error"
        icon
        v-if="customizeMode"
        @click="$emit('remove-widget', widget.i)"
      >
        <v-icon>mdi-minus-circle</v-icon>
      </v-btn>
    </span>
    <v-card>
      <v-card-text
        style="height:100%"
        :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
      >
        <v-row style="height:100%">
          <v-col cols="7">
            <v-row>
              <v-col cols="12">
                <div class="caption text-uppercase">
                  <span>
                    Machine Name
                  </span>
                </div>
                <div class="headline">
                  M1
                </div>
              </v-col>
              <v-col cols="12">
                <div class="caption text-uppercase">
                  <span>
                    Product
                  </span>
                </div>
                <div class="headline">
                  Top Spout Flat Sachet
                </div>
              </v-col>
              <v-col cols="12">
                <div class="caption text-uppercase">
                  <span>
                    Production
                  </span>
                </div>
                <div class="headline">
                  10
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Rejections
                  </span>
                </div>
                <div class="title">
                  0
                </div>
              </v-col>
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Rejection %
                  </span>
                </div>
                <div class="title">
                  0%
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5" class="my-auto text-center">
            <div class="caption text-uppercase">Availability</div>
            <v-progress-circular
              size="120"
              width="15"
              :value="98.4"
              color="success"
              :rotate="270"
            >
              98.4
            </v-progress-circular>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'MachineCard',
  props: {
    widget: {
      type: Object,
      default: null,
    },
    customizeMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.widget && this.widget.definition.title;
    },
  },
};
</script>
