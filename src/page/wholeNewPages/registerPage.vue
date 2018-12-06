<template>
  <div id="wrapper">
    <div id="center">
      <div class="backIcon download-icon-wrapper" @click="goBack()">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconControl['left-icon']"></use>
        </svg>
      </div>
      <div class="large-logo-wrapper">饿了么</div>

      <form>
        <div class="input-wrapper" v-for="(item,index) in inputArr">
          <input :type="item.type" :placeholder="item.placeholder" :index="index"
                 :class="{'ifActive':selected==index}"
                 @click="selected=index"
                 @input="chargeNumber($event)">
        </div>
        <button class="getMessage" :class="{'getMessageActive':messageActive}" @click="getMessage()">获取验证码</button>

        <div class="other-info">
          新用户登录即自动注册，并表已同意
          <a href="#">《用户服务协议》</a>
        </div>
        <div class="submit-btn" @click="login">
          <button type="button">登录</button>
        </div>
      </form>
      <div class="about-us">关于我们</div>
    </div>

    <div v-if="loading" class="loading-wrapper" :class="{active:loading}">
      <v-loading></v-loading>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import loadingAnimation from "../utilsComponents/loadingAnimation"

  export default {
    name: "FailHomePage",
    components:{
      "v-loading": loadingAnimation
    },
    data() {
      return {
        selected: -1,
        inputArr: {0: {"type": "text", "placeholder": "手机号"}, 1: {"type": "password", "placeholder": "验证码"}},
        messageActive: false,
        loading: false
      }
    },
    computed: {
      ...mapState(["iconObj"]),
      iconControl() {
        return {"left-icon": this.iconObj["left-icon"],}
      }
    },
    methods: {
      goBack() {
        this.$router.push({name: "register"});
      },
      getMessage() {
        alert("模拟验证码，123456")
      },
      chargeNumber(e) {
        if (e.target.type == "text") {
          let reg = /^\d{11}$/;
          let val = e.target.value;
          if (reg.test(val)) {
            this.messageActive = true
          } else {
            this.messageActive = false
          }
        } else {
          this.messageActive = false
        }
      },
      login() {
        let timer = null;
        let temp = new Promise((resolve) => {
          resolve(this.$store.dispatch("login"))
        });
        temp.then(() => {
          this.loading = true;
          timer = setTimeout(() => {
            this.$router.push({name:"register"});
            clearTimeout(timer)
          }, 2000)
        });
      }
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  #wrapper {
    text-align: center;
    position: relative;
    padding-top: 10vw;
    margin: 0 auto;
    background: rgb(255, 255, 255);
    height: 100vh;
    width: 100vw;
    display: flex;
  }

  #center {
    width: 580px;
    margin: 0 auto;
  }

  .backIcon {
    position: absolute;
    left: 0px;
    top: 8vw;
    color: #666;
    z-index: 3;
  }

  .large-logo-wrapper {
    font-size: 0.9rem;
    display: inline-block;
  }

  form {
    position: relative;
    margin-top: 11.5vw;
  }

  .input-wrapper {
    display: inline-block;
    position: relative;
    margin-bottom: 32px;
    height: 96px;
    width: 560px;
    font-size: 28px;
    background: rgb(255, 255, 255);
  }

  .input-wrapper input {
    width: 100%;
    height: 100%;
    padding-left: 20px;
    border: 1px solid rgb(174, 174, 174);
    border-radius: 8px;
    color: rgb(51, 51, 51);
    font-size: .4rem;
  }

  .ifActive {
    border-color: rgb(0, 137, 220) !important;
  }

  .getMessageActive {
    color: rgb(0, 137, 220) !important;
  }

  .getMessage {
    display: inline;
    position: absolute;
    top: 30px;
    right: 10px;
    color: rgb(204, 204, 204);
    background: rgba(0, 0, 0, 0);
    text-align: center;
    font-size: 28px;
  }

  .other-info {
    margin-top: 24px;
    color: rgb(153, 153, 153);
    font-size: 28px;
    line-height: 40px;

  a {
    color: rgb(35, 149, 255);
  }

  }

  .submit-btn {

  button {
    display: block;
    width: 100%;
    height: 84px;
    margin-top: 40px;
    border-radius: 8px;
    background: rgb(76, 217, 111);
    color: rgb(255, 255, 255);
    cursor: pointer;
    text-align: center;
    font-size: 32px;
    line-height: 84px;
  }

  }

  .about-us {
    margin-top: 40px;
    text-align: center;
    color: rgb(153, 153, 153);
  }

  .loading-wrapper{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0);
    transition: background-color 0.5s ease-in-out;
    z-index: 1;
  }
  .loading-wrapper.active{
    background-color: rgba(0,0,0,0.3);
  }
</style>
