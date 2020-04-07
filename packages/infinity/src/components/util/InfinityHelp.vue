<template>
  <v-menu
    bottom
    offset-y
    z-index="9999"
    transition="slide-y-transition"
  >
    <template #activator="{ on: menu }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            icon
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon
              v-text="'$help'"
            ></v-icon>
          </v-btn>
        </template>
        <span class="text-center">
          {{ $t('helper.help') }}
        </span>
      </v-tooltip>
    </template>
    <v-list dense>
      <template v-for="(item, index) in items">
        <v-subheader
          :key="index"
          v-if="item.header"
          class="mb-0 pb-0 text-uppercase"
          v-text="$t(`help.${item.header}`)"
        ></v-subheader>
        <v-divider
          :key="index"
          class="pb-1"
          v-else-if="item.divider"
        ></v-divider>
        <v-list-item
          v-else
          :key="index"
          @click="action(item.action)"
        >
          <v-list-item-title
            v-text="$t(`help.${item.title}`)"
          ></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'InfinityHelp',
  data() {
    return {
      items: [
        {
          header: 'help',
        },
        {
          title: 'keyboardShortcuts',
          icon: '$keyboard',
          action: 'openKeyboardShortcuts',
        },
        {
          title: 'support',
          icon: '$support',
          action: 'openSupport',
        },
        {
          divider: true,
        },
        {
          header: 'legal',
        },
        {
          title: 'terms',
          action: 'openTerms',
        },
        {
          title: 'privacy',
          action: 'openPrivacy',
        },
      ],
    };
  },
};
</script>
