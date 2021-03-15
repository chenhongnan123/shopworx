<template>
  <v-container>
    <v-row>
      <v-col lg="3" xl="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-list-item
              v-for="(item, n) in items"
              :key="n"
              link
            >
              <v-list-item-icon>
                <v-icon color="success">
                  mdi-checkbox-marked-circle
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item
              link
              color="grey lighten-4"
            >
              <v-list-item-icon>
                <v-icon>
                  mdi-checkbox-blank-circle
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Review & finish
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
      }, {
        name: 'Assets & license',
      }, {
        name: 'Roles & access',
      }],
    };
  },

};
</script>
