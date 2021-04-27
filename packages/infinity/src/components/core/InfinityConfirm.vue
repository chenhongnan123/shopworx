<template>
  <v-dialog
    attach
    v-model="dialog"
    max-width="400px"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          {{ title }}
        </span>
      </v-card-title>
      <v-card-text>
        <span>
          {{ message }}
        </span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          class="text-none"
          @click.native="cancel"
        >
          {{ $t('helper.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          @click.native="agree"
        >
          {{ $t('helper.agree') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InfinityConfirm',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
    };
  },
  methods: {
    open(title, message) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
