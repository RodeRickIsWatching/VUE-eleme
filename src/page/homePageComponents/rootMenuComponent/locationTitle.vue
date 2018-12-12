<template>
  <div class="wrapper">
    <div class="location-wrapper">
      <div class="location-info">
        <div class="header" @click="clickLocationFlag(true)">
          <div class="download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['location-icon']"></use>
            </svg>
          </div>
          <span v-if="orderedLocation.defaultLocation&&!loading">{{orderedLocation.defaultLocation}}</span>
          <span v-else-if="loading">正在定位...</span>
          <span v-else>未能获取地址</span>
          <div class="download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['down-icon']"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!--此处需要点击事件，查找店铺-->
    <div class="location-input">
      <div class="button-wrapper">
        <a class="content">
          <span>搜索饿了么商家、商品名称</span>
        </a>
      </div>
    </div>

    <!--loading动画-->
    <div v-if="loading&&storeList&&homePageNav&&otherInfo" >
      <div class="shell-placeholder">
        <div class="shell-wrapper" v-for="(item,index) in homePageNav">
          <div class="shell-content" v-for="(item2,index2) in item" v-if="index2<=4">
          </div>
        </div>
      </div>

      <v-loading></v-loading>
      <!--<div class="loading-animate-wrapper"></div>-->
      <!--<div class="shield-wrapper"></div>-->
    </div>

    <div class="img-wrapper" v-if="!orderedLocation.defaultLocation&&!loading">
      <img src="../../../assets/no-location.gif">
      <span>输入地址后才能订餐哦！</span>
      <button>手动选择地址</button>
    </div>

    <div class="content">
      <v-navBar v-if="orderedLocation.defaultLocation&&!loading&&homePageNav"></v-navBar>
      <v-otherInfo v-if="orderedLocation.defaultLocation&&!loading&&otherInfo" class="other-info"></v-otherInfo>
      <v-storeLists v-if="orderedLocation.defaultLocation&&!loading&&storeList"></v-storeLists>
    </div>


    <!--显示城市组件-->
    <transition name="slideAnimate">
      <v-selectLocation v-show="chooseLocationFlag" class="new-page"></v-selectLocation>
    </transition>

  </div>


</template>

<script>
  import {mapState, mapActions, mapMutations} from "vuex"
  import navBar from "../rootMenuComponent/navBar"
  import otherInfo from "../rootMenuComponent/otherInfo"
  import storeLists from "../rootMenuComponent/storeLists"
  import selectLocation from "../rootMenuComponent/selectLocation"
  import loadingAnimation from "../../utilsComponents/loadingAnimation"

  export default {
    name: "location-title",
    data() {
      return {
        loading: true
      }
    },
    created() {
      if (this.userInfo || this.orderedLocation.defaultLocation) {
        this.loading = false;
      } else {
        let timer = setTimeout(() => {
          this.loading = false;
          clearTimeout(timer)
          this.$once("click",this.clickLocationFlag(true));
        }, 2000)
      }
    },
    computed: {
      ...mapState(["storeList","iconObj", "orderedLocation", "userInfo", "otherInfo", "homePageNav", "chooseLocationFlag"])
    },
    components: {
      "v-navBar": navBar,
      "v-otherInfo": otherInfo,
      "v-storeLists": storeLists,
      "v-selectLocation": selectLocation,
      'v-loading': loadingAnimation
    },
    methods: {
      ...mapMutations(["changeLocationFlag"]),
      clickLocationFlag(_state) {
        if (!this.loading) {
          this.changeLocationFlag(_state);
        } else {
          this.changeLocationFlag(false);
        }
      }
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .new-page {
    height: 100%;
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow: auto;
  }

  .slideAnimate-enter-active, .slideAnimate-leave-active {
    transition: left 0.3s;
  }

  .slideAnimate-enter, .slideAnimate-leave-to {
    left: 100%;
  }

  .slideAnimate-enter-to, .slideAnimate-leave {
    left: 0;
  }

  .location-info {
    padding: 2.666667vw 3.733333vw 0;
    font-size: 0.45rem;
    font-weight: 800;
    color: #fff;
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));

  .header {
    height: 9.2vw;
    line-height: 9.2vw;
    display: inline-block;

  span {
    margin-left: -1vw;
    margin-right: -1vw;
  }

  div {
    display: inline-block;
  }

  }
  }

  .location-input {
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));
    z-index: 888;
    /*sticky无效，容器高度太小*/
    /*解决方法：将其他组件变成该组件的子组件，撑开高度即可*/
    position: sticky;
    top: 0px;
    font-size: .4rem;
    color: rgb(153, 153, 153);

  .button-wrapper {
    padding: 2vw 3.733333vw;
    margin: -.133333vw 0;

  a {
    border-radius: .266667vw;
    background: rgb(255, 255, 255);
    color: rgb(153, 153, 153);
    display: flex;
    width: 100%;
    height: 9.6vw;
    justify-content: center;
    align-items: center;
  }

  }
  }

  .img-wrapper {
    min-height: 138.666667vw;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

  img {
    display: block;
    width: 53.333333vw;
  }

  span {
    margin: 3.333333vw 0 2.666667vw;
    color: rgb(106, 106, 106);
    font-weight: 400;
    font-size: .453333rem;
  }

  button {
    padding: 2.666667vw;
    min-width: 32vw;
    border: none;
    border-radius: .533333vw;
    background-color: rgb(86, 209, 118);
    color: rgb(255, 255, 255);
    text-align: center;
    font-size: 1.2em;
    font-family: inherit;
  }

  }
  .other-info {
    margin-bottom: 2.133333vw;
    padding: 0 2.666667vw;
    font-size: 0;
  }

  .content {
    background: rgb(255, 255, 255);
  }

  .shell-placeholder {
    display: flex;
    flex-direction: column;
    align-content: space-between;
  }

  .shell-wrapper {
    padding-top: 2.933333vw;
    display: flex;
  }

  .shell-content {
    flex: 1;
    flex-direction: column;
    display: flex;
    align-items: center;

  &::before {
    content: "";
    display: inline-block;
    animation: placeholder 1.5s infinite linear;
    width: 10.666667vw;
    height: 10.666667vw;
    margin-top: .8vw;
    margin-bottom: .533333vw;
    border-radius: 50%;
  }

  &::after {
    content: "";
    display: inline-block;
    animation: placeholder 1.5s infinite linear;
    width: 8vw;
    height: 3.733333vw;
    margin-top: 1.333333vw;
  }

  }
  @keyframes placeholder {
    0% {
      background: rgb(244, 244, 244);
    }
    50% {
      background: rgb(227, 227, 227);
    }
    100% {
      background: rgb(244, 244, 244);
    }
  }


</style>
