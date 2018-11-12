import Vue from 'vue';
import iView from 'iview';
import Vuex from 'vuex';
Vue.use(Vuex); 
Vue.use(iView); 

import evnInfo from './modules/evnInfo';
import bafflelist from './modules/baffledata';
import getters from './getters';

const state = {
  newPro:'',   //整体布局中的选择项目
  newProtocol:'',  //全局配置中接口默认协议的协议存储:HTTP
  newWay:'',   //全局配置中接口默认协议的请求方式:POST/GET
  checkPointConfig:'' //检查点存储
}
const store = new Vuex.Store({
  state,
  modules: {
    evnInfo,
    bafflelist
  },
  getters
});

export default store
