<template>
  <div class="wrapper">
    <div class="header">
      <div class="download-icon-wrapper" @click="goBack">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
      <h1 class="header-info">账户信息</h1>
    </div>

    <div class="user-info-wrapper">
      <div class="item-wrapper">
        <div class="item-title">头像</div>
        <div class="item-container">
          <div class="item-item">
            <div class="item-info">
              <!--<img src="../../assets/register-logo.png" v-myPreLoad="{loaded:require('../../assets/user-header.png'),loading:require('../../assets/register-logo.png')}">-->
              <img v-myPreLoad="{loaded:require('../../assets/user-header.png'),
                              loading:require('../../assets/register-logo.png')}">
            </div>
            <div class="right-icon download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconObj['right-icon']"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="onepx-border-bottom"></div>
      </div>

      <div class="item-wrapper">
        <div class="item-title">用户名</div>
        <div class="item-container">
          <div class="item-item">
            <div class="item-info">
              {{userInfo.mainInfo.userName}}
            </div>
            <div class="right-icon download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconObj['right-icon']"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="onepx-border-bottom"></div>
      </div>

      <div class="divide-wrapper">
        <span>账号绑定</span>
      </div>
      <div class="item-wrapper">
        <div class="item-title">
          <div class="mobile-icon download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['mobile-icon']"></use>
            </svg>
          </div>
          手机
        </div>
        <div class="item-container">
          <div class="item-item">
            <div class="item-info">
              {{phoneCal}}
            </div>
            <div class="right-icon download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconObj['right-icon']"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="onepx-border-bottom"></div>
      </div>

      <div class="divide-wrapper">
        <span>安全设置</span>
      </div>
      <div class="item-wrapper">
        <div class="item-title secondary">登录密码</div>
        <div class="item-container">
          <div class="item-item">
            <div class="item-info password-item">
              修改
            </div>
            <div class="right-icon download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconObj['right-icon']"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="onepx-border-bottom"></div>
      </div>
    </div>
    <div class="logoff-wrapper" @click="logoff">
      <button class="logoff-button">退出登录</button>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from "vuex"

  export default {
    name: "userInfo",
    computed: {
      ...mapState(["iconObj", "userInfo"]),
      phoneCal(){
        let phone = this.userInfo.mainInfo.userPhone;
        let reg = /(?<=\d{3})[\d]+(?=\d{4})/;
        return phone.replace(reg,'****')
      }
    },
    methods:{
      ...mapActions(["removeLoginState"]),
      goBack(){
        this.$router.push({name:"register"});
      },
      logoff(){
        setTimeout(() => {
          this.removeLoginState();
          this.$router.go(0);
          this.$router.push("register");
        //  这里有个问题，当删除cookie后，不刷新页面只是路由跳转
        //  不会改变之前页面中的渲染数据
        //  因此需要手动刷新
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .wrapper{
    height: 100vh;
    background-color: rgb(238,238,238);
  }

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

  .download-icon-wrapper {
    font-weight: 700;
    font-size: 1.173333rem;
    display: inline-block;
  }

  .user-info-wrapper {
    background-color: rgb(255, 255, 255);
    width: 100%;
    font-size: .426667rem;
    color: rgb(51, 51, 51);
  }

  .item-wrapper{
    padding: 3.666667vw 3.733333vw;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .item-info{
    display: inline-block;
    margin-right:5vw;
  img{
      border-radius: 50%;
      border: 1px solid transparent;
    }
  }
  .item-title{
    font-weight: 700;
  }
  .right-icon{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
  }
  .divide-wrapper{
    background-color: #eee;
    span{
      display: inline-block;
      margin: 4.266667vw 0 1.866667vw 3.733333vw;
      font-size: .32rem;
      color: rgb(153, 153, 153);
    }
  }

  .mobile-icon{
    font-size: 0.6rem;
    color: #1e6cff;
    vertical-align: middle;
    padding: .533333vw;
    margin-right: -1.333333vw;
    margin-bottom: 1vw;
  }
  .password-item{
    color: rgb(0, 151, 255);
  }
  .secondary{
    font-weight: 500;
  }

  .logoff-button{
    display: block;
    width: 100%;
    text-align: center;
    padding: 3.733333vw 0;
    margin: 5.333333vw 0;
    color: rgb(255, 83, 57);
    border-radius: .8vw;
    font-size: .426667rem;
    font-weight: 700;
    background-color: rgb(255, 255, 255);
  }

</style>
