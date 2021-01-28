<template>
    <div>
      <span
        class="title font-weight-regular"
        v-if="title"
        v-text="title"
      ></span>
      <v-card :class="title === null ? 'mt-8' : ''">
        <v-card-text>
          <v-row no-gutters>
            <span class="headline font-weight-regular success--text">PRODUCTION</span>
            <v-col cols="12" class="py-2">
              <div>
                Part
              </div>
              <div class="title">
                {{ details.partname }}
              </div>
              <div>
                Plan wise actual
              </div>
              <div class="title">
                {{ details.planWiseActual }}
              </div>
              <div>
                Remaining quantity
              </div>
              <div class="title">
                {{ details.remainingQuantity }}
              </div>
              <div>
                Plan completion
              </div>
              <div class="title">
                {{ details.plancompletion }}
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters>
            <span class="headline font-weight-regular error--text mt-2">DOWNTIME</span>
            <v-col cols="12" class="py-2">
              <div>
                Down since
              </div>
              <div class="title">
                <span v-if="details.downtimestart">
                  {{ new Date(details.downtimestart).toLocaleString('en-IN') }}
                </span>
                <span v-else>-</span>
              </div>
              <div>
                Reason
              </div>
              <div class="title">
                -
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters>
            <span class="headline font-weight-regular info--text mt-2">REJECTION</span>
            <v-col cols="12" class="py-2">
              <div>
                Rejected quantity
              </div>
              <div class="title">
                {{ details.rejectionquantity }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider v-if="action !== null"></v-divider>
        <v-card-actions class="pa-0">
          <v-select
            solo
            flat
            dense
            single-line
            hide-details
            v-if="showDateFilter"
            :items="['Today', 'Yesterday', 'Last 7 days']"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            class="text-none"
            v-if="action !== null"
            @click="$router.push(action.route)"
          >
            <span v-text="action.text"></span>
            <v-icon right>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
</template>

<script>
export default {
  name: 'TextWidget',
  props: {
    title: {
      type: String,
      default: null,
    },
    action: {
      type: Object,
      default: null,
    },
    showDateFilter: {
      type: Boolean,
      default: false,
    },
    details: {
      type: Object,
      default: null,
    },
  },
};
</script>
