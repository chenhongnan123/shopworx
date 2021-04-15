<template>
    <v-app>
      <Header/>
      <!-- <p style="height:5%;"></p> -->
      <router-view></router-view>
    </v-app>
</template>

<script>
import "../src/assets/css/common.css";
import Header from './components/Header'
export default {
  name: 'app',
  components:{
    Header,
  }
}
</script>

<style lang='scss'>

html,body{
  height: 100%;
}
.v-application{
  height: 100%;
  .v-application--wrap {
    // font-family: 'Avenir', Helvetica, Arial, sans-serif;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    // color: #2c3e50;
    font-family: Arial-BoldMT;
    height: 100%;
    padding-top:.8rem;
    box-sizing:border-box;
    p{
      margin: 0;
      padding: 0;
    }
  }
  .row{
    margin: 0;
  }
  .col{
    padding: 0;
  }
}


</style>
