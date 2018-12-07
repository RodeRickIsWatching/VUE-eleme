// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '../mock/index.js'
import axios from "axios"
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
  error: require("./assets/register-logo.png"),
  loading: require("./assets/register-logo.png"),
  preLoad: 2
//  懒加载底部触发的位置，数值越小高度越小，数值相对大效果最好，在滑动到的前一刻进行加载，这样用户看不到loading图片
})

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

//设置默认路由
router.push("/home");

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

Vue.directive('myPreLoad',{
  inserted: function(el,binding){
    el.src = binding.value.loading;
    el.onload = function(){
      let tempHeight = window.getComputedStyle(el).height;
      let tempWidth = window.getComputedStyle(el).width;
      let img = new Image();
      img.src = binding.value.loaded;
      img.onload = function(){
        setTimeout(()=>{
          el.src = img.src;
          el.style.height = tempHeight;
          el.style.width = tempWidth;
        },2000)
      }
    }






  }
});


