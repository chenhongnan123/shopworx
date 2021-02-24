<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
    <v-btn v-on="on"
    small color="primary" outlined class="text-none ml-2" @click="checkMainId">
            {{ $t('displayTags.buttons.cancel') }}
    </v-btn>
    </template>
      <v-card>
        <v-card-title class="headline">Cancle?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Cancle?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteSubline"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      newSubLine: {},
      assetId: 4,
      default: false,
      dialog: false,
    };
  },
  props: {
    rework: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // ...mapActions('reworkOperation', ['deleteSubline']),
    async checkMainId() {
      if (this.rework.enterManinId) {
        this.dialog = true;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MAINID_EMPTY',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
