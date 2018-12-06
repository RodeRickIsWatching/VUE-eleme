<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods:{
      readUserState(){
        this.$store.dispatch("readLoginState");
        //想不到怎么在router里使用vuex或者在vuex中使用router
        //因此在这里使用，即当有userInfo说明登录过了，改变路由状态
        //这里的0和3是router中配置的第x个路由
        if(this.$store.state.userInfo){
          this.$router.options.routes[0].children[3].meta.ifLogin = true;
        }else{
          this.$router.options.routes[0].children[3].meta.ifLogin = false;
        }
      },
    },
    created(){
      //第一次进入页面时尝试读取cookie
      this.readUserState();
    }
  }
</script>

<style lang="scss" type="text/css">
  @import "./style/utils.scss";

  html {
    font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
    height: 100vh;
    width: 100vw;
    background-color: rgb(247, 247, 247);
    overflow-y: auto;
  }

</style>
