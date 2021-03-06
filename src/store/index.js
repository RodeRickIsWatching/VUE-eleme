import vue from "vue"
import vuex from "vuex"
import CookieManage from "../../static/utils/cookie"
import storageManage from "../../static/utils/storage"
import sessionStorageManage from "../../static/utils/sessionStorage"
import axios from "axios"

vue.use(vuex);

export default new vuex.Store({
  modules: {

    checkoutInfos: {
      namespaced: true,
      state: {
        checkOutInfo: null,
        tempUpdate: null
      },
      mutations: {
        getCheckOutInfo(state, _list) {
          state.tempUpdate = Object.assign({}, _list);
        },
        downloadCheckOutInfo(state, _list) {
          state.checkOutInfo = Object.assign({}, _list);
        }
      },
      actions: {
        getCheckOutInfo({commit, state, rootState}) {
          if (rootState.storeInfos.storeInfo && rootState.storeInfos.shoppingList && rootState.storeInfos.menuInfo) {
            let totalQuantity = 0;
            for (let i in rootState.storeInfos.shoppingList) {
              totalQuantity += rootState.storeInfos.shoppingList[i].foodCount;
            }

            let tempObj = {
              "foodList": rootState.storeInfos.shoppingList,
              "wholePrice": rootState.storeInfos.menuInfo.wholePrice,
              "storeName": rootState.storeInfos.storeInfo.seller.name,
              "discountPrice": rootState.storeInfos.menuInfo.discountPrice,
              "totalQuantity": totalQuantity,
              "storeId": rootState.storeInfos.menuInfo.storeId,
              "time": new Date().getTime()
            };

            commit("getCheckOutInfo", tempObj)
          }
        },
        downloadCheckOutInfo({commit, state, rootState}, temp) {
          commit("downloadCheckOutInfo", temp)
        }
      }

    },
    // },
    // modules:{
    storeInfos: {
      namespaced: true,
      state: {
        storeInfo: null,
        ifCovered: false,
        shoppingList: {},
        menuInfo: {}
      },
      mutations: {
        ifCover(state, _state) {
          //  控制弹出层
          state.ifCovered = _state
        },
        getStoreInfos(state, _info) {
          state.storeInfo = Object.assign({}, _info);
        },
        clearShoppingList(state) {
          // 路由跳转时清空原数据（直接刷新页面也可以清空，但是效果不好）
          state.shoppingList = Object.assign({}, {});
          state.menuInfo = Object.assign({}, {});
        },
        updateShoppingList(state, {_menuIndex, _foodIndex, _count, _storeNum}) {
          // 初始化列表
          if (!state.shoppingList[`${_menuIndex}${_foodIndex}`]) {
            state.shoppingList[`${_menuIndex}${_foodIndex}`] = {};
          }
          if (!state.menuInfo["menuCount"]) {
            state.menuInfo["menuCount"] = {};
          }
          if (!state.menuInfo.menuCount[_menuIndex]) {
            state.menuInfo.menuCount[_menuIndex] = 0;
          }
          if (!state.menuInfo["menuCountAll"]) {
            state.menuInfo["menuCountAll"] = 0;
          }
          //更新列表
          let tempCount = 0;
          tempCount = state.shoppingList[`${_menuIndex}${_foodIndex}`]["foodCount"] ? state.shoppingList[`${_menuIndex}${_foodIndex}`]["foodCount"] + _count : 1;
          let singlePrice = state.storeInfo["goods"][_menuIndex]["foods"][_foodIndex]["price"];
          let tempPrice = 0;
          tempPrice = Math.round(singlePrice * tempCount * 10) / 10;
          state.shoppingList[`${_menuIndex}${_foodIndex}`] = {
            "foodIndex": _foodIndex,
            "foodName": state.storeInfo["goods"][_menuIndex]["foods"][_foodIndex]["name"],
            "foodCount": tempCount,
            "foodSinglePrice": singlePrice,
            "foodPrice": tempPrice
          };


          let temp = 0;
          let arr = Object.keys(state.menuInfo.menuCount);
          for (let i in state.shoppingList) {
            temp += state.shoppingList[i].foodPrice;
          }
          for (let j in arr) {
            if (_menuIndex == arr[j]) {
              state.menuInfo.menuCount[arr[j]] = state.menuInfo.menuCount[arr[j]] ? state.menuInfo.menuCount[arr[j]] + _count : _count;
            }
          }
          state.menuInfo.wholePrice = Math.round(temp * 10) / 10;

          state.menuInfo.storeId = _storeNum;

          //删除为0的列表
          for (let i in state.shoppingList) {
            if (state.shoppingList[i].foodCount == 0) {
              delete state.shoppingList[i];
            }
          }
          for (let i in state.menuInfo) {
            if (state.menuInfo[i].menuCount == 0) {
              delete state.menuInfo[i];
            }
          }

          //更新对象
          state.shoppingList = Object.assign({}, state.shoppingList);
          state.menuInfo = Object.assign({}, state.menuInfo);
        },
      },
      actions: {
        clearShoppingList({commit}) {
          commit("clearShoppingList");
        },
        updateShoppingList({commit}, {_menuIndex, _foodIndex, _count, _storeNum}) {
          commit("updateShoppingList", {_menuIndex, _foodIndex, _count, _storeNum});
        },
        getStoreInfo({commit, state}, _query) {
          axios.get(`/${_query}`)
            .then((response) => {
              sessionStorageManage.set('storeInfo', JSON.stringify(response.data.data));
              commit("getStoreInfos", response.data.data);
            });
        },
        getStorageInfo({commit, state, dispatch}, _query) {
          dispatch("getStoreInfo", _query);
          state.storeInfo = Object.assign({}, sessionStorageManage.get('storeInfo'));
        }
      }
    }
  },
  state: {
    iconObj: {
      "red-pocket-icon": "#icon-hongbao",
      "wallet-icon": "#icon-rechargefill",
      "coin-icon": "#icon-coin",
      "mobile-icon": "#icon-mobile",
      "left-icon": "#icon-left",
      "right-icon": "#icon-right",
      "down-icon": "#icon-down",
      "service-icon": "#icon-service",
      "present-icon": "#icon-liwu",
      "shopping-mall-icon": "#icon-shopfill",
      "location-icon": "#icon-locationfill",
      "logo-icon": "#icon-changyonglogo40-copy",
      "shopping-cart-icon": "#icon-gouwuche1",
      "delete-icon": "#icon-deletefill",
      "order-icon": "#icon-formfill",
      "my-icon": "#icon-my",
      "discover-icon": "#icon-discoverfill",
      "add-icon": "#icon-plus-circle-fill",
      "minus-icon": "#icon-minus-circle",
      "loading-icon": "#icon-loading"
    },
    userInfo: null,
    orderedLocation: null,
    homePageNav: null,
    otherInfo: null,
    carouselSrc: null,
    storeList: null,
    locationLists: null,
    cityLists: null,
    chooseLocationFlag: false,
    chooseCityFlag: false,
    choosedCity: ''
  },
  mutations: {
    getLocationLists(state, _info) {
      if (_info) {
        state.locationLists = [..._info];
      } else {
        state.locationLists = _info;
      }
    },
    getCityLists(state, _info) {
      state.cityLists = _info;
      state.cityLists = Object.assign({}, state.cityLists);
      console.log(state.cityLists)
    },
    getStoreListsInfo(state, _info) {
      state.storeList = [..._info];
    },
    getHomePageInfo(state, _info) {
      state.homePageNav = _info.homePageNav;
      state.otherInfo = _info.otherInfo;
      state.otherInfo = [...state.otherInfo];
      state.homePageNav = [...state.homePageNav];
    },
    readLoginState(state) {
      if (state.userInfo) {
        //  读取过了不需要再次读取
        return true
      } else {
        if (CookieManage.get('userId')) {
          //第一次读取到信息，设置cookie带来的用户信息
          //并且设置用户默认送货地址
          //...暂时省略数据库匹配

          let tempObj = JSON.parse(CookieManage.get('userId'));
          state.userInfo = Object.assign({}, tempObj.userInfo);
          state.orderedLocation = Object.assign({}, tempObj.orderedLocation);
          state.choosedCity = state.userInfo.city;
          return true
        } else {
          //没有读取到信息
          state.userInfo = null;
          state.orderedLocation = {
            "orderedName": "",
            "orderedPhone": "",
            "defaultLocation": ""
          };
          storageManage.delete('userInfo');
          return false
        }
      }
    },
    setUserInfoCookie(state, _info) {
      CookieManage.set('userId', JSON.stringify(_info), 0.5);
      // storageManage.set('userInfo', JSON.stringify(_info), 0.5);
    },
    removeLoginState() {
      CookieManage.delete('userId');
      storageManage.delete('userInfo');
      this.userInfo = null;
    },
    changeLocationFlag(state, statement) {
      //用于控制选择城市那个页面的动画效果
      state.chooseLocationFlag = statement;
    },
    changeCityFlag(state, statement) {
      //用于控制选择城市那个页面的动画效果
      state.chooseCityFlag = statement
    },
    updateNowLocation(state, _location) {
      if (state.userInfo) {
        //userInfo存在说明city选定了
        state.orderedLocation.defaultLocation = _location;
      } else {
        state.orderedLocation = {
          "orderedName": "",
          "orderedPhone": "",
          "defaultLocation": _location
        };
      }
      state.orderedLocation = Object.assign({}, state.orderedLocation)
    }
  },

  actions: {
    removeLoginState({commit}) {
      commit("removeLoginState")
    },
    readLoginState({commit, dispatch, state}, _info) {
      //读取用户信息
      commit("readLoginState", _info);
      dispatch("getHomePageInfos");
    },
    login({commit,dispatch}, {ID, passWord, err, suc, self}) {
      //登录，并将信息放到cookie
      axios.post("/userInfo", {
        ID: ID,
        passWord: passWord
      })
      .then((response) => {
        if(response.data.data){
          //验证成功开启读取动画
          self.loading = true;
          //开启异步
          (async (_data)=>{
            let temp = new Promise((resolve)=>{
              resolve(commit("setUserInfoCookie",_data));
            });
            await temp;
            dispatch("readLoginState",response.data.data);
          })(response.data.data);

          let timer = setTimeout(() => {
            //模拟读取了2s的数据
            suc(self);
            clearTimeout(timer)
          }, 2000)
        }else{
          err(self)
        }
      })

    },
    getCityLists({commit}) {
      //不论是否登录都可以看到
      axios.get("/cityLists")
        .then((response) => {
          commit("getCityLists", response.data.data)
        });
    },
    getLocationLists({commit, state}, _city) {
      //不论是否登录都可以看到
      //确定城市后，获取路名（最好是通过post请求，为了方便使用get）
      if (_city) {
        state.choosedCity = _city;
        axios.get("/locationLists")
          .then((response) => {
            commit("getLocationLists", response.data.data)
          });
      } else {
        commit("getLocationLists", null)
      }
    },
    updateNowLocation({commit, dispatch}, location) {
      //不论是否登录都可以看到
      //更新地址后，改变商铺列表
      commit("updateNowLocation", location);
      dispatch("getHomePageInfos");
    },
    getHomePageInfos({commit, state}) {
      axios.get("/storeLists")
        .then((response) => {
          commit("getStoreListsInfo", response.data.data);
        });
      axios.get("/homePageInfos")
        .then((response) => {
          commit("getHomePageInfo", response.data.data);
        })
    }
  }
})
