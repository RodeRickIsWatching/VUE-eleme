import Vue from 'vue'
import Router from 'vue-router'


const register = () => import('@/page/homePageComponents/register');
const rootMenu = () => import('@/page/homePageComponents/rootMenu');
const discover = () => import('@/page/homePageComponents/discover');
const order = () => import('@/page/homePageComponents/order');
const HomePage = () => import('@/page/wholeNewPages/homePage');
const RegisterPage = () => import('@/page/wholeNewPages/registerPage');
const UserInfo = () => import('@/page/wholeNewPages/userInfo');
const StoreInfo = () => import('@/page/wholeNewPages/storeInfoPage');
const goods = () => import('@/page/storeInfoPageComponents/goods');
const seller = () => import('@/page/storeInfoPageComponents/seller');
const assessment = () => import('@/page/storeInfoPageComponents/assessment');
const checkOut = () => import('@/page/storeInfoPageComponents/checkOut');

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      component: HomePage,
      redirect: {name: 'home'},
      children: [{
        path: 'home',
        name: 'home',
        meta: {index: 0},
        component: rootMenu
      },
        {
          path: 'discover',
          name: 'discover',
          meta: {index: 1},
          component: discover
        },
        {
          path: 'order',
          name: 'order',
          meta: {index: 2},
          component: order
        }, {
          path: 'register',
          name: 'register',
          meta: {ifLogin: false, index: 3},
          component: register
        }]
    },
    {
      path: '/userInfoPage',
      component: UserInfo,
      beforeEnter: (to, from, next) => {
        // console.log(from.meta.ifLogin);
        // if (!from.meta.ifLogin) {
        if(!window.localStorage.getItem("userInfo")){
          next('/registerPage')
        } else {
          next();
        }
      }
    },
    {
      path: '/registerPage',
      component: RegisterPage,
      //使用路由守卫的最大好处是，整个vue实例都可以访问的到
      beforeEnter: (to, from, next) => {
        // if (from.meta.ifLogin) {
          if(window.localStorage.getItem("userInfo")){
          next('/userInfoPage')
        } else {
          next();
        }
      }
    },
    {
      path: '/store/:id/:storeNum',
      //由于有子路由，因此不能使用name属性！
      meta:{
        keepAlive: true
      },
      component: StoreInfo,
      children: [
        {
          path: '',
          redirect: {name:'goods'}
        },
        {
          path: 'goods',
          name:'goods',
          component: goods,
          meta:{
            keepAlive: true
          },
        },
        {
          path: 'seller',
          component: seller
        },
        {
          path: 'assessment',
          component: assessment
        }
      ]
    },
    {
      path: '/checkOut',
      name: 'checkOut',
      component: checkOut
    }
  ]
})
