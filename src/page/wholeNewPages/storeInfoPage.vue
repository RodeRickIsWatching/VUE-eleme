<template>
  <div class="wrapper">
    <div v-if="storeInfo&&!loading">
      <v-storeTitle></v-storeTitle>

      <div class="link-view-wrapper">
        <div class="nav-wrapper">
          <div class="link-wrapper">
            <router-link :to="{path:`/store/${$route.params.id}/${$route.params.storeNum}/goods`}" >
              <span :class="{'link-active':ifActive=='goods'}" @click="ifActive='goods'">点餐</span>
            </router-link>
          </div>
          <div class="link-wrapper">
            <router-link :to="{path:`/store/${$route.params.id}/${$route.params.storeNum}/assessment`}">
              <span :class="{'link-active':ifActive=='assessment'}" @click="ifActive='assessment'">评价</span>
            </router-link>
          </div>
          <div class="link-wrapper">
            <router-link :to="{path:`/store/${$route.params.id}/${$route.params.storeNum}/seller`}">
              <span :class="{'link-active':ifActive=='seller'}" @click="ifActive='seller'">商家</span>
            </router-link>
          </div>
        </div>

        <div class="router-view">
          <router-view></router-view>
        </div>
      </div>

    </div>

    <div v-else>
      <v-loading></v-loading>
    </div>


  </div>

</template>

<script>
  import storeHead from "../storeInfoPageComponents/storeHeader"
  import loadingAnimation from "../utilsComponents/loadingAnimation"
  import {mapState, mapActions} from  "vuex"

  export default {
    name: "storeInfoPage",
    data(){
      return {
        ifActive: 'goods',
        loading: true
      }
    },
    computed:{
      ...mapState("storeInfos",["storeInfo"]),
    },
    components: {
      "v-storeTitle": storeHead,
      "v-loading": loadingAnimation
    },
    methods:{
      ...mapActions("storeInfos", ["getStorageInfo","getStoreInfo","clearShoppingList"]),
    },
    created() {
      // this["getStoreInfo"](`${this.$route.params.storeNum}`);
      //获取存到storage中的信息，由于每个店铺不同且是覆盖存储，因此每次进页面都需要get
      //而不是通过判断值不存在才取值
      if(!this.storeInfo){
        this["getStorageInfo"](`${this.$route.params.storeNum}`);

        let timer = setTimeout(() => {
          this.loading = false;
          clearTimeout(timer)
        }, 1000)
      }else{
        // this.loading = false;

        //下面是模拟,上面是正常形式
        let timer = setTimeout(() => {
          this.loading = false;
          clearTimeout(timer)
        }, 500)
      }
    },
    beforeDestroy(){
      // 在离开该路由时清空对象
      this.clearShoppingList();
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .nav-wrapper {
    position: sticky;
    top: 0px;
    /*z-index: 2;*/
    line-height: 10.666667vw;
    display: flex;
    background-color: rgb(255, 255, 255);
  }
  .link-wrapper{
    position: relative;
    flex: 1;
    text-align: center;
    font-size: .4rem;
    color: rgb(102, 102, 102);
    border-bottom: 1px solid rgb(235, 235, 235);
    a{

    }
  }
  .link-active{
    color: rgb(51, 51, 51);
    font-weight: 700;
    display: inline-block;
    position: relative;
  }
  .link-active::after{
    background-color: rgb(35, 149, 255);
    content: "";
    position: absolute;
    display: inline;
    bottom: 0;
    left: 0;
    right: 0;
    height: .533333vw;
  }

  .router-view{
    /*height: 100vh;*/
    /*overflow: hidden;*/
    position: relative;
    z-index: 0;
  }


  .link-view-wrapper{
    height: 100vh;
  }
</style>
