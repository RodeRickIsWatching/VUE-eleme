<template>
  <div class="wrapper">
    <div class="header">
      <div class="backIcon download-icon-wrapper">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconControl['left-icon']"></use>
        </svg>
      </div>
      <h1 class="header-info">我的</h1>
    </div>
    <div class="login-wrapper">
      <div class="register-info" @click="toLoginPage($event)">
        <img src="../../assets/register-logo.png">
        <div class="title-info">
          <span class="title" v-if="userInfo == null">登录/注册</span>
          <span class="title" v-else>{{userInfo.mainInfo.userName}}</span>
          <div class="additional-info">
            <div class="mobile-icon download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconControl['mobile-icon']"></use>
              </svg>
            </div>
            <span v-if="userInfo == null">登录后享受更多特权</span>
            <span v-else>{{userInfo.mainInfo.userPhone}}</span>
          </div>
        </div>
      </div>

      <div class="right-icon download-icon-wrapper">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconControl['right-icon']"></use>
        </svg>
      </div>
    </div>

    <!--登录前-->
    <div class="main-sections-wrapper" v-if="userInfo==null">
      <div class="main-sections" v-for="(item,index) in mainInfoArr">
        <div class="download-icon-wrapper"
             :class="{'wallet-icon':index=='wallet','red-pocket-icon':index=='discount','coin-icon':index=='coins'}">
          <svg class="download-icon" aria-hidden="true">
            <use :xlink:href="mainInfoIconObj[index]"></use>
          </svg>
        </div>
        <span class="type-info">{{item}}</span>
      </div>
    </div>

    <!--登陆后-->
    <div class="main-sections-wrapper" v-else>
      <div class="main-sections" v-for="(item,index2) in userInfo.otherInfo">
        <div class="download-icon-wrapper"
             :class="{'wallet-info':index2=='wallet','red-pocket-info':index2=='discount','coin-info':index2=='coins'}">
          <div v-if="index=0" class="count-info">{{item}}<span>元</span>
          </div>
          <div v-else class="count-info">{{item}}<span>个</span>
          </div>
        </div>
        <span class="type-info">{{mainInfoArr[index2]}}</span>
      </div>
    </div>

    <div class="other-sections">
      <div class="sections-wrapper" v-for="(item,index) in iconControlArr">
        <div class="section" :class="index2" v-for="(item2,index2) in item">
          <div class="more-info-icon download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="item2.icon"></use>
            </svg>
          </div>
          <span class="address">{{item2.article}}</span>
          <div class="right-icon download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconControl['right-icon']"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "register",
    data() {
      return {
        mainInfoArr: {
          "wallet": "钱包",
          "discount": "红包",
          "coins": "金币"
        }
      }
    },
    computed: {
      ...mapState(["iconObj", "userInfo"]),
      mainInfoIconObj() {
        return {wallet:this.iconObj["wallet-icon"], discount:this.iconObj["red-pocket-icon"], coins:this.iconObj["coin-icon"]}
      },
      iconControlArr() {
        return {
          mainSection: {section0: {"article": "我的地址", "icon": this.iconObj["location-icon"]}},
          secondarySection: {
            section1: {"article": "金币商城", "icon": this.iconObj["shopping-mall-icon"]},
            section2: {"article": "分享拿10元现金", "icon": this.iconObj["present-icon"]},
          },
          thirdSection: {
            section3: {"article": "我的客服", "icon": this.iconObj["service-icon"]},
            section4: {"article": "下载饿了么APP", "icon": this.iconObj["logo-icon"]}
          }
        }
      },
      iconControl() {
        return {
          "left-icon": this.iconObj["left-icon"],
          "right-icon": this.iconObj["right-icon"],
          "mobile-icon": this.iconObj["mobile-icon"]
        }
      }
    },
    methods: {
      toLoginPage(e) {
        this.$router.push('/registerPage');
        if (this.$router.options.routes[0].children[3].meta.ifLogin) {
          alert("跳转至用户信息页面");
        } else {
          alert("跳转至登录页面");
        }
      },
      readUserState() {
        this.$store.dispatch("readLoginState");
        //想不到怎么在router里使用vuex或者在vuex中使用router
        //因此在这里使用，即当有userInfo说明登录过了，改变路由状态
        //这里的0和3是router中配置的第x个路由
        if (this.$store.state.userInfo) {
          this.$router.options.routes[0].children[3].meta.ifLogin = true;
        } else {
          this.$router.options.routes[0].children[3].meta.ifLogin = false;
        }
      }
    },
    created() {
      //每次进入register页面会查询user的状态
      this.readUserState();
    }

  }
</script>

<style lang="scss" scoped type="text/css">
  @import "../../style/utils.scss";

  .header {
    width: 100%;
    color: #fff;
    height: 1.173333rem;
    line-height: 1.173333rem;
    position: relative;
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));
  }

  .header-info {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    display: inline-block;
    font-weight: 700;
    font-size: 0.48rem;
  }

  .login-wrapper {
    color: #fff;
  }

  .register-info {
    padding: 6.666667vw 4vw;
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));
  }

  .register-info img {
    border-radius: 50%;
  }

  .title-info {
    display: inline-block;
    font-size: 0.56rem;
    font-weight: 700;
    margin-left: 4vw;
    vertical-align: top;
    margin-top: 18px;
  }

  .title {
    display: block;
    margin-bottom: 2.6vw;
  }

  .additional-info {
    font-size: 0.33rem;
    font-weight: 500;
    margin-left: -1.5vw;
  }

  .mobile-icon {
    display: inline-block;
    font-size: 0.35rem;
    margin-right: -.666667vw;
  }

  .right-icon {
    position: absolute;
    right: 0.15rem;
    top: 2.2rem;
  }

  .main-sections-wrapper {
    text-align: center;
    display: table;
    font-size: 0.33rem;
    font-weight: 700;
    height: 22.4vw;
    width: 100%;
    background-color: #fff;

  .type-info {
    color: rgb(102, 102, 102);
  }

  }

  .main-sections {
    display: table-cell;
    vertical-align: middle;
    border-right: 1px solid rgb(221, 221, 221);
    width: 33.3333%;
  }

  .count-info {
    font-size: 0.7rem;
    line-height: 3.2vw;

  span {
    font-size: .32rem;
  }

  }

  .wallet-icon, .wallet-info {
  @include main-sections-icon(orange);
  }

  .red-pocket-icon, .red-pocket-info {
  @include main-sections-icon(rgb(252, 123, 83));
  }

  .coin-icon, .coin-info {
  @include main-sections-icon(rgb(148, 217, 74));
  }

  .other-sections {
    width: 100%;
  }

  .sections-wrapper {
    vertical-align: middle;
    margin-top: 2.666667vw;
    font-size: .426667rem;
    color: rgb(51, 51, 51);
  }

  .section {
    border-top: 1px solid rgb(221, 221, 221);
    border-bottom: 1px solid rgb(221, 221, 221);
    background-color: #fff;
    padding: 3.733333vw 2.666667vw 3.2vw 3.5vw;
    position: relative;

  div {
    display: inline-block;
  }

  .right-icon {
    position: absolute;
    right: 8vw;
    top: 2vw;
    color: rgb(194, 194, 194);
    width: 0.18rem;
    height: 0.18rem;
  }

  }
  .section1,
  .section3 {
    border-bottom: 0px;
  }

  .more-info-icon {
    font-size: 0.5rem;
    margin-right: 0.2rem;
  }

  .section0 .more-info-icon {
    color: rgb(74, 165, 240);
  }

  .section1 .more-info-icon {
    color: rgb(148, 217, 74);
  }

  .section2 .more-info-icon {
    color: rgb(252, 123, 83);
  }

  .section3 .more-info-icon {
    color: rgb(74, 165, 240);
  }

  .section4 .more-info-icon {
    color: rgb(74, 165, 240);
  }


</style>
