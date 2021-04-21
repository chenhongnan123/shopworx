<template>
  <div style="height:100%;" class="time-moudle">
    <v-row  class="text-center">
      <v-col cols="12" >
        <span>{{dateTime}}</span>
      </v-col>
      <!-- <v-col cols="4">
        <span>{{'shift1'}}</span>
      </v-col> -->
      <!-- <v-col cols="3">
        <v-select
          v-model="languange"
          :items="languangeItems"
          item-text="name"
          item-value="id"
          label="Select languange"
          solo
          height=".4rem"
        ></v-select>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'TimeMoudle',
  data() {
    return {
      dateTime: null,
    };
  },
  mounted() {
    setInterval(() => {
      this.dateTime = this.getDateTime();
    }, 1000);
  },
  methods: {
    getDateTime(dateNum) {
      const dateObj = new Date(dateNum || new Date().getTime());
      return this.addZero(this.addZero(dateObj.getFullYear()) + '-' + this.addZero(dateObj.getMonth() + 1) + '-' + dateObj.getDate()) + ' ' + this.addZero(dateObj.getHours()) + ':' + this.addZero(dateObj.getMinutes()) + ':' + this.addZero(dateObj.getSeconds());
    },
    addZero(num) {
      return num.toString().length === 1 ? '0'.num : num;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .time-moudle{
    .text-center{
      >.col{
        opacity: 0.7;
        background: #0E1826;
        border: .01rem solid #778DA8;
        height: .44rem;
        line-height: .44rem;
        box-sizing: border-box;
        font-size: .24rem;
      }
      >.col:nth-child(1){
        border-right:none;
      }
    }
  }
</style>
