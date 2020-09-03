<template>
  <v-navigation-drawer
    app
    right
    clipped
    width="300"
    v-model="drawer"
    :color="$vuetify.theme.dark ? '#212121' : 'white'"
  >
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#212121' : 'white'"
    >
      <v-toolbar-title>
        Add Widgets
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleCustomizeMode">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-text-field
      dense
      rounded
      outlined
      class="px-2"
      prepend-inner-icon="$search"
    ></v-text-field>
    <perfect-scrollbar style="height: calc(100% - 170px);">
      <v-list
        dense
        class="py-0"
      >
        <v-list-item
          :key="index"
          v-for="(item, index) in availableWidgets"
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-action>
            <v-btn
              small
              color="success"
              icon
              @click="addWidget(item)"
            >
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'WidgetAddDrawer',
  computed: {
    ...mapState('maintenanceSummary', ['customizeMode', 'allWidgets', 'widgets']),
    drawer: {
      get() {
        return this.customizeMode;
      },
      set(val) {
        this.setCustomizeMode(val);
      },
    },
    availableWidgets() {
      return this.allWidgets.filter((widget) => {
        const currentWidgets = this.widgets
          .filter((w) => w.definition.component === widget.component);
        return currentWidgets && currentWidgets.length < widget.maxCount;
      });
    },
  },
  methods: {
    ...mapMutations('maintenanceSummary', [
      'setCustomizeMode',
      'toggleCustomizeMode',
      'setWidgets',
    ]),
    addWidget(widget) {
      const pos = this.findValidPosition(widget);
      let i = 1;
      if (this.widgets && this.widgets.length) {
        const sortedWidgets = this.widgets.sort((a, b) => a.i - b.i);
        i = sortedWidgets[sortedWidgets.length - 1].i + 1;
      }
      const addedWidget = {
        ...pos,
        i,
        definition: widget,
      };
      this.setWidgets([...this.widgets, addedWidget]);
    },
    findValidPosition(definition, currentWidget = null) {
      // Find next available space
      const w = (currentWidget && currentWidget.w)
      || definition.defaultWidth || definition.minWidth;
      const h = (currentWidget && currentWidget.h)
      || definition.defaultHeight || definition.minHeight;
      // Mark occupied positions on the grid
      const grid = new Map();
      this.widgets.forEach((widget) => {
        if (widget !== currentWidget) {
          for (let { x } = widget; x < widget.x + widget.w; x += 1) {
            for (let { y } = widget; y < widget.y + widget.h; y += 1) {
              grid.set(`${x}:${y}`, true);
            }
          }
        }
      });
      // Go through the possible positions
      let x = 0;
      let y = 0;
      const condition = true;
      while (condition) {
        // Virtual "line brak"
        if (x !== 0 && x + w >= 7) {
          x = 0;
          y += 1;
        }
        const { result, testX } = this.hasEnoughSpace(grid, x, y, w, h);
        if (!result) {
          x = testX + 1;
        } else {
          // Found! :)
          break;
        }
      }
      return {
        x,
        y,
        w,
        h,
      };
    },

    hasEnoughSpace(grid, x, y, w, h) {
      // Test if enough horizontal available space
      for (let testX = x; testX < x + w; testX += 1) {
        // Test if enough vertical available space
        for (let testY = y; testY < y + h; testY += 1) {
          if (grid.get(`${testX}:${testY}`)) {
            return { result: false, testX };
          }
        }
      }
      return { result: true };
    },
  },
};
</script>
