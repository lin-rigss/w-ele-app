import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';


// 禁止显示生产模式的消息
Vue.config.productionTip = false;

// 将axios 挂载到vue原型上
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
