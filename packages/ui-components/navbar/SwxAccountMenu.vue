<template>
  <v-menu
    bottom
    offset-y
    z-index="9999"
    transition="slide-y-transition"
  >
    <template #activator="{ on }">
      <v-btn
        text
        v-on="on"
        class="text-none"
      >
        <v-avatar
          size="36"
          color="secondary"
        >
          <v-icon v-text="'$account'"></v-icon>
        </v-avatar>
        <span
          class="mx-1"
          v-text="fullName"
        >
        </span>
        <v-icon
          small
          v-text="'$expand'"
        >
        </v-icon>
      </v-btn>
    </template>
    <v-list dense nav>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="index"
          v-text="$t(`infinity.account.headers.${item.header}`)"
          class="mb-0 pb-0"
        ></v-subheader>
        <v-divider
          v-else-if="item.divider"
          :key="index"
          class="pb-1"
        ></v-divider>
        <v-list-item
          v-else-if="item.id"
          :class="activeSite === item.id ? 'secondary white--text' : ''"
          :key="index"
          @click="actionWithValue(item.action, item.id)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <v-list-item
          v-else
          :key="index"
          @click="action(item.action)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title
            v-text="$t(`infinity.account.menu.items.${item.title}`)"
          ></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SwxAccountMenu',
  props: {
    fullName: {
      type: String,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    action(actionName) {
      this.$emit(actionName);
    },
    actionWithValue(actionName, value) {
      this.$emit(actionName, value);
    },
  },
};
</script>
