<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .ivu-form-item-content {
    line-height: 0px;
    font-size: 14px;
  }
  .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav .ivu-tabs-tab {
    /* background-color: #2d8cf0; */
    /* border:none; */
    background-color: #01babc;
    color:#fff;
    margin-right:1px;
    border:none;
  }
  .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav .ivu-tabs-tab-active{
    color:#01babc;
    background: #fff;
    border-top:2px solid #01babc;
    border-left:1px solid #01babc;
    border-right:1px solid #01babc;
    box-sizing: border-box;
  }
  .ivu-tabs-bar{
    border-bottom:1px solid #01babc;
  }
  .ivu-message{
    top:100px !important;
  }

  textarea.ivu-input {
    font-size: 12px;
  }
</style>
