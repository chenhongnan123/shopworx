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
        Available Widgets
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
      v-model="search"
      prepend-inner-icon="$search"
    ></v-text-field>
    <perfect-scrollbar style="height: calc(100% - 170px);">
      <v-list
        dense
        v-if="filteredWidgets.length"
        class="py-0"
      >
        <v-list-item
          :key="index"
          v-for="(item, index) in filteredWidgets"
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
      <v-card flat class="transparent" v-else-if="availableWidgets.length === 0">
        <v-card-text class="text-center" style="height: 280px">
          <v-row align="center" no-gutters style="height: 100%">
            <v-col>
              <div class="title font-weight-regular">
                Your available widgets appear here.
              </div>
              <div class="subheading">
                No widget available!
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card flat class="transparent" v-else>
        <v-card-text class="text-center" style="height: 280px">
          <v-row align="center" no-gutters style="height: 100%">
            <v-col>
              <div class="title font-weight-regular">
                No widget found for {{ search }}
              </div>
              <div class="subheading">
                Widget not found!
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'WidgetAddDrawer',
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapState('modelManagement', ['customizeMode', 'allWidgets', 'widgets']),
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
    filteredWidgets() {
      if (this.search) {
        return this.availableWidgets
          .filter((w) => w.title.toLowerCase().includes(this.search.toLowerCase()));
      }
      return this.availableWidgets;
    },
  },
  methods: {
    ...mapMutations('modelManagement', [
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
