// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import store from './store/index.js';
import router from './router';
//引入图标echarts
import echarts from 'echarts';
//添加主题
import 'echarts/theme/infographic.js';


Vue.use(iView);
Vue.prototype.$Message.config({
  top : 150,
  duration : 3
})

import global from './Global.vue';
Vue.prototype.$Global = global;

Vue.prototype.$axios = axios;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.config.productionTip = false
// 设置请求根路径
// axios.defaults.baseURL = 'http://128.192.206.16:8080/'
// axios.defaults.baseURL = 'http://128.196.96.111:8000/'
// axios.defaults.baseURL = 'http://128.192.206.53:8000/'
//axios.defaults.baseURL = 'http://128.195.0.12:8080/'
// 配置axios
Vue.prototype.$http = axios;
//配置echarts
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
