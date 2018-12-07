<template>
  <div class="wrapper">
    <section class="header" :class="{'take-place':!storeInfo}">
      <div class="store-background-wrapper"
           v-if="storeInfo"
           v-lazy:background-image="{src: bgArr[0]}">
      <!--:style="{ backgroundImage: 'url('+ bgArr[0] +')'}">-->
        <!--放壁纸--></div>
      <div class="download-icon-wrapper back-icon" @click="$router.push('/')">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
    </section>
    <section class="content">
      <div class="logo-wrapper" :class="{'take-place':!storeInfo}">
        <!--<img :src="logoArr[0]">-->
        <img v-lazy="logoArr[0]">
      </div>
      <div class="store-name-wrapper" :class="{'take-place':!storeInfo}">
        <h2 v-if="storeInfo">
          <span>{{ storeInfo.seller.name}}</span>
          <div class="download-icon-wrapper">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['right-icon']"></use>
            </svg>
          </div>
        </h2>
        <div class="store-info-wrapper" :class="{'take-place':!storeInfo}">
          <span v-if="storeInfo">
            <span>评价{{storeInfo.seller.score}}</span>
            <span>月售{{storeInfo.seller.sellCount}}单</span>
            <span>商家配送约{{storeInfo.seller.deliveryTime}}分钟</span>
          </span>
        </div>
      </div>

      <div class="activity-wrapper" :class="{'take-place':!storeInfo}">
        <div class="activity-container">
          <div class="activity-item" v-if="storeInfo">
            <span class="activity-tag mini-tag">满减</span>
            <span class="activity-content">{{storeInfo.seller.supports[0].description}}</span>
          </div>
        </div>
          <div class="activity-counts" v-if="storeInfo" @click="ifCover(true)">{{activityCounts()}}</div>
          <div class="download-icon-wrapper more-activity-icon" v-if="storeInfo" @click="ifCover(true)">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['down-icon']"></use>
            </svg>
          </div>
      </div>
      <div class="announcement-wrapper" :class="{'take-place':!storeInfo}">
        <span v-if="storeInfo">
          公告：{{storeInfo.seller.bulletin}}，{{storeInfo.seller.bulletin}}，{{storeInfo.seller.bulletin}}
        </span>
      </div>
    </section>

<!--<transition name="slide">-->
  <v-cover v-if="ifCovered" class="cover-wrapper"></v-cover>
<!--</transition>-->

  </div>
</template>

<script>
  import {mapState,mapMutations} from "vuex"
  import coverComponents from "./headerComponents/coverComponents"
  export default {
    name: "storeHeader",
    data(){
      return {
        logoArr:[],
        bgArr:[],
      }
    },
    components:{
      "v-cover":coverComponents
    },
    computed: {
      ...mapState(["iconObj"]),
      ...mapState('storeInfos', ["storeInfo","ifCovered"]),
    },
    methods:{
      ...mapMutations('storeInfos',["ifCover"]),
      activityCounts() {
        if(this.storeInfo&&this.storeInfo.seller){
          return `${this.storeInfo.seller.supports.length}个优惠`
        }else{
          return ``
        }
      },
      getLogoImg(){
          let temp = require(`../../assets/stores/${this.$route.params.id}-logo.webp`);
          this.logoArr.push(temp);
      },
      getBgImg(){
          let temp = require(`../../assets/stores/${this.$route.params.id}-bg.webp`);
          this.bgArr.push(temp);
      }
    },
    created(){
      this.getLogoImg();
      this.getBgImg();
    }
  }
</script>

<style lang="scss" type="text/css" scoped>

  .wrapper {
    color: rgb(51, 51, 51);
    font-size: .293333rem;
    background-color: rgb(255, 255, 255);
    padding-top: 26.666667vw;
    position: relative;
  }

  .header {
    height: 26.666667vw;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .back-icon {
    display: inline-block;
    font-size: 1.173333rem;
    color: #fff;
    transform: translateZ(1px);
  }

  .store-background-wrapper {
    height: 26.666667vw;
    position: absolute;
    left: 0;
    right: 0;
    /*background: url("../../assets/store0-bg.webp");*/
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    &::before{
       content: "";
       position: absolute;
       left: 0;
       right: 0;
       top: 0;
       bottom: 0;
       background-image: linear-gradient(0deg,rgba(255, 255, 255, 0),rgba(0,0,0,.5));
     }
  }

  .content {
    padding: 8vw 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
  }

  .logo-wrapper {
    width: 20vw;
    height: 20vw;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -10vw;
    margin-top: -16vw;
  }

  .store-name-wrapper {
    flex: 1;
    width: 72vw;

  h2 {
    font-size: .546667rem;
    font-weight: 700;
    white-space: nowrap;
    position: relative;
    padding-right: 2.666667vw;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

  span {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  }
  }
  .store-info-wrapper {
    white-space: nowrap;
    height: 3.2vw;
    margin-top: 2.733333vw;
    font-size: .293333rem;
    color: rgb(102, 102, 102);
    text-align: center;
    span{
      margin-right: 1.5vw;
    }
  }

  .activity-wrapper {
    display: flex;
    color: rgb(51, 51, 51);
    margin: 3.2vw auto 0;
    align-items: center;
    width: 80vw;
    font-size: .293333rem;
  }

  .activity-container {
    flex: 1;
    overflow: hidden;
  }
  .activity-item{
    display: flex;
    align-items: center;
  }

  .activity-counts {
    width: 16.266667vw;
    flex-shrink: 0;
    position: relative;
    padding-right: 2.933333vw;
    text-align: right;
    color: rgb(153, 153, 153);
  }

  .announcement-wrapper {
    width: 80vw;
    font-size: .293333rem;
    color: rgb(153, 153, 153);
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 2.266667vw auto 2.666667vw;
    padding: 0;
    white-space: nowrap;
  }

  .activity-tag {
    margin-right: 1.6vw;
    font-size: .24rem;
    padding: .533333vw 1.2vw;
    height: 3.466667vw;
    display: inline-block;
    box-sizing: border-box;
    border-radius: .266667vw;
    color: #fff;
  }

  .mini-tag {
    background-color: rgb(240, 115, 115);
  }

  .activity-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    line-height: normal;
  }

  .take-place {
    background-color: rgb(212, 212, 212);
  }

  .more-activity-icon {
    margin-left: -3vw;
  }

  .cover-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9;
  }
</style>
