<template>
  <header>
    <img src="../assets/logo_po.jpg" style="height:.8rem;"/>
    <h2>{{'PRODUCTION OVERALL INFORMATION'}}</h2>
    <img src="../assets/shopworx.png" style="height:100%;"/>
  </header>
</template>

<script>
import {  mapState,mapMutations } from 'vuex';
export default {
  name: 'charts',
  computed:{
    ...mapState({
      title: state => state.common.title,
      isAutoRunning: state => state.common.isAutoRunning,
    })
  },
  mounted(){
    this.$i18n.locale = 'eh'
  }
}
</script>

<style scoped lang="scss">
  header{
    position: fixed;
    width: 100%;
    height: .8rem;
    background: #fff;
    top: 0;
    color: rgba(0, 0, 0,.7);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
    box-sizing: border-box;
    line-height:.8rem;
    h2{
      font-size: .36rem;
      color: rgba(0,0,0,0.87);
    }
  }
</style>
