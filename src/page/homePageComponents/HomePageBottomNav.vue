<template>
  <div>
    <router-view></router-view>
    <ul>
      <router-link v-for="(item,index) in navArr " :key="index"
                   :to="{name:routerArr[index]}">
        <li @click="nowClickIndex=index"
            :class="{'click-active':nowClickIndex===index}">
          <div class="download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconControl[index]"></use>
            </svg>
          </div>
          <span>{{item}}</span>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "HomePageBottomNav",
    data() {
      return {
        navArr: ["首页", "发现", "订单", "我的"],
        nowClickIndex: 0,
        routerArr: ["home", "discover", "order", "register"]
      }
    },
    computed: {
      ...mapState(["iconObj"]),
      iconControl() {
        return [this.iconObj["logo-icon"], this.iconObj["discover-icon"], this.iconObj["order-icon"], this.iconObj["my-icon"]]
      },
    },
    created(){
      // this.$router.push({name:'home'});
      // this.$route.meta.index = 0;
      //页面刷新后自动读取选择的路由，并给予active样式
      this.nowClickIndex = this.$route.meta.index;
    }
  }
</script>

<style lang="scss" scoped type="text/css">
  @import "../../style/utils.scss";

  ul {
    background-color: rgb(255, 255, 255);
    z-index: 9999;
    position: fixed;
    bottom: 0;
    display: flex;
    text-align: center;
    color: #8e8e93;
    font-size: .266667rem;
    width: 100%;
    padding-top: 1.2vw;
    height: 12.333333vw;
    box-shadow: 0 -0.266667vw 0.533333vw rgba(0, 0, 0, .1);

  li {
    flex: 1;
    margin-top: 10px;
    margin-bottom: -5px;

  span {
    display: block;
  }

  }
  }
  .download-icon-wrapper {
  @include download-icon-font(inline-block, 40px);
    margin-left: 0px;
    margin-bottom: 5px;
  }

  .click-active {
    color: #0089dc;
  }

  a {
    display: inline-block;
    width: 100%;
  }
</style>
