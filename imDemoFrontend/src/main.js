// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import store from './store/index'
import VueSocketIO from 'vue-socket.io'

import api from './utils/axios'
import apiPath from './utils/apiPath'
Vue.prototype.api = api;
Vue.prototype.apiPath = apiPath;

Vue.config.productionTip = false
Vue.use(
  new VueSocketIO({
    debug: true, // debug调试，生产建议关闭
    connection: "http://localhost:3000",
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    options: {     //Optional options, 
      autoConnect:false, //关闭自动连接，在用户登录后在连接。
    }
  })
);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  sockets: {
    connect: function () {
      console.log("Socket Connected");
    }
  },
  router,
  components: { App },
  template: '<App/>'
})
