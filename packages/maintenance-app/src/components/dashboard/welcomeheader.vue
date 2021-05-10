<template>
  <v-card style="height: 266px;" id="welcomeheader">
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-subtitle class="text-h6 pb-0" v-text="today"></v-card-subtitle>
        <v-card-title class="text-h5 pt-2">{{
          `${$t('general.hello')}, ${this.operator.operatorname}`
        }}</v-card-title>
        <v-card-subtitle class="text-h5 pt-7 pr-0">{{
          $t('maintenancetask.welcomeheader', { task: this.todoList.length })
        }}</v-card-subtitle>
      </div>

      <v-avatar class="ma-3" size="150" tile style="width: 300px;">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
          style="background-size: 90% 130%;background-position: center 5px;"
        ></v-img>
      </v-avatar>
    </div>
    <v-row style="height: 92px;" class="ma-0">
      <v-col cols="6" class="pa-0">
        <v-card color="red" class="ma-2">
          <v-card-title primary-title class="white--text">
            <span>Delay</span>
            <v-spacer></v-spacer>
            <v-chip
              color="white"
              style="flex: none;font-size: 20px;"
              small
              outlined
              class="text-none"
            >
              {{ delay }}
            </v-chip>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" class="pa-0">
        <v-card color="blue lighten-3" class="ma-2">
          <v-card-title primary-title class="white--text">
            <span>Today</span>
            <v-spacer></v-spacer>
            <v-chip
              color="green lighten-1"
              style="flex: none;font-size: 20px;"
              small
              class="text-none white--text mr-2"
            >
              {{ finished.length }}
            </v-chip>
            |
            <v-chip
              style="flex: none;font-size: 20px;"
              small
              color="primary"
              class="text-none ml-2"
            >
              {{ todaytasks.length }}
            </v-chip>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { isBeforeDate, dayStart } from '@shopworx/services/util/date.service';

export default {
  name: 'WelcomeHeader',
  data() {
    return {};
  },
  computed: {
    ...mapState('maintenance', ['todoList', 'todaytasks']),
    ...mapState('auth', ['operator']),
    illustration() {
      return this.$vuetify.theme.dark ? 'setup-dark' : 'setup-light';
    },
    today() {
      const weekday = this.$t(`week[${new Date().getDay()}]`);
      const month = this.$t(`month[${new Date().getMonth()}]`);
      return `${weekday}, ${new Date().getDate()} ${month}`;
    },
    delay() {
      // eslint-disable-next-line arrow-body-style
      return this.todoList.filter((todo) => {
        return isBeforeDate(new Date(Number(todo.planendtime)), dayStart(new Date()));
      }).length;
    },
    finished() {
      return this.todaytasks.filter((task) => task.status === 'completed');
    },
  },
};
</script>

<style lang="sass">
#welcomeheader .v-image__image--cover
  background-size: 90% 130%
  background-position: center 0px!important
</style>
