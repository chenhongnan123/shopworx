<template>
  <v-container>
    <v-row>
      <v-col lg="3" xl="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <template v-for="(item, index) in items">
              <v-divider
                :key="index"
                class="my-2"
                v-if="item.divider"
              ></v-divider>
              <v-list-item
                link
                v-else
                :key="index"
                :to="{ params: { id: item.to } }"
              >
                <v-list-item-icon>
                  <v-icon
                    :color="item.status === 'complete' ? 'success' : 'primary'"
                  >
                    {{ icons[item.status] }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet
          min-height="70vh"
          rounded="lg"
        >
          <!--  -->
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CustomerContainer',
  data() {
    return {
      icons: {
        pending: 'mdi-checkbox-blank-circle-outline',
        inProgress: 'mdi-checkbox-blank-circle',
        complete: 'mdi-checkbox-marked-circle',
      },
      items: [{
        name: 'Customer & sites',
        to: '1',
        status: 'inProgress',
      }, {
        name: 'Assets & license',
        to: '2',
        status: 'pending',
      }, {
        name: 'Roles & access',
        to: '3',
        status: 'pending',
      }, {
        name: 'Add users',
        to: '4',
        status: 'pending',
      }, {
        divider: true,
      }, {
        name: 'Review & finish',
        to: '5',
        status: 'pending',
      }],
    };
  },
  created() {
    this.redirect();
  },
  watch: {
    id() {
      this.redirect();
    },
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    redirect() {
      this.routes = this.items.filter((item) => item.to);
      const to = this.routes.map((item) => item.to);
      if (this.id === undefined) {
        if (this.items && this.items.length) {
          this.$router.push({ params: { id: to[0] } });
        }
      } else if (this.id) {
        const validId = to.includes(this.id);
        if (!validId) {
          const invalidPath = this.$route.fullPath;
          this.$router.push({ name: '404', params: { 0: invalidPath } });
        }
      }
    },
  },
};
</script>
