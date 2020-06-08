<template>
  <v-card
    hover
    outlined
    style="height:100%; border-radius: 8px"
    @click="$router.push({ name: 'machine-detail', params: { id: machine.machinename } })"
  >
    <v-card-title class="py-0" :class="machine.machinename === 'M1' ? 'success' : ''">
      {{ machine.machinename }}
      <v-spacer></v-spacer>
      Top Spout Flat Sachet
    </v-card-title>
    <v-card-text
      style="height:100%"
      :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
    >
      <v-row style="height:100%">
        <v-col cols="7" class="my-auto">
          <v-row>
            <v-col cols="12">
              <div class="caption text-uppercase">
                <span>
                  Production
                </span>
              </div>
              <div class="headline">
                {{ assetState.qty }}
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
            :value="assetState.availability"
            color="success"
            :rotate="270"
          >
            <div>
              {{ assetState.availability }}
            </div>
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MachineCard',
  props: {
    machine: {
      type: Object,
      required: true,
    },
    assetState: {
      type: Object,
    },
  },
  data() {
    return {
      schemaUp: {
        primary: {
          title: 'actual',
          value: 'actualquantity',
        },
        secondary: [
          {
            title: 'planned',
            value: 'plannedquantity',
          },
          {
            title: 'target',
            value: 'targetquantity',
          },
        ],
        tertiary: {
          title: 'efficiency',
          value: 'stdproduction',
        },
      },
      schemaDown: {
        primary: {
          title: 'downtimeSince',
          value: 'downtimestart',
        },
        secondary: [
          {
            title: 'downtimeReason',
            value: 'downtimereason',
          },
        ],
        tertiary: {
          title: 'efficiency',
          value: 'efficiency',
        },
      },
    };
  },
};
</script>
