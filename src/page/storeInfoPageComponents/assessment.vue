<template>
  <div class="wrapper">
    <!--分数总览-->
    <section class="over-view">
      <div class="multiple-score-wrapper">
        <div class="multiple-score-score" v-if="storeInfo">
          <span>{{storeInfo.seller.score}}</span>
        </div>
        <div class="multiple-score-img-wrapper">
          <span class="multiple-score-title">商家评分</span>
          <div class="multiple-score-img-item">
            <div class="empty-star"><img src="../../assets/empty-star.svg"></div>
            <div class="filled-star" v-if="storeInfo"
                 :style="{width:`${storeInfo.seller.score/5*100}%`}"
            ><img src="../../assets/filled-star.svg"></div>
          </div>
        </div>
      </div>
      <div class="all-score-wrapper" v-if="storeInfo">
        <div class="taste-package-score">
          <div>
            <span>味道</span>
            <p>{{storeInfo.seller.foodScore}}</p>
          </div>
          <div>
            <span>包装</span>
            <p>{{storeInfo.seller.serviceScore}}</p>
          </div>
        </div>
        <div class="delivery-score">
          <span>配送</span>
          <p>{{storeInfo.seller.foodScore}}</p>
        </div>
      </div>
    </section>
    <!--评论-->
    <div class="assessment-wrapper">
      <ul v-if="storeInfo">
        <li v-for="(item,index) in tagObj"
            @click="nowTag=index"
            :class="{active:nowTag==index}">
          <span>{{storeInfo["ratings"]["ratingTags"][index]}} {{item}}</span>
        </li>
      </ul>
      <!--<component v-bind:is="ratingBodyComponent"></component>-->

      <!--<keep-alive>-->
        <v-ratingBody
          v-for="(item,index) in tagObj"
          :key="index"
          :nowTag="nowTag"
          v-if="nowTag==index"
        ></v-ratingBody>
      <!--</keep-alive>-->

    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import ratingBodyComponent from "./assessmentComponents/ratingBodyComponent"

  export default {
    name: "assessment",
    computed: {
      ...mapState("storeInfos", ["storeInfo"]),
    },
    components:{
      'v-ratingBody':ratingBodyComponent
    },
    data(){
      return {
        tagObj: {},
        nowTag: 0,
      }
    },
    methods: {
      tagInit() {
        if (this.storeInfo && this.storeInfo.ratings && this.storeInfo.ratings.ratingInfos && this.storeInfo.ratings.ratingTags) {
          let temp = this.storeInfo.ratings.ratingInfos;
          let temp2 = this.storeInfo.ratings.ratingTags;
          for(let i in temp2){
            this.tagObj[i] = 0;
          }
          for (let i = 0; i < temp.length; i++) {
            for(let j = 0; j < temp[i].rateType.length; j++){
              this.tagObj[temp[i].rateType[j]]++;
            }
          }
        }else{
          throw error("数据格式错误")
        }
      },
      // tagCal(_item, _index) {
      //   let str = ``;
      //   if (this.storeInfo && this.storeInfo.ratings && this.storeInfo.ratings.ratingInfos.rateType) {
      //     let temp = this.storeInfo.ratings.ratingInfos.rateType;
      //     for (let i = 0; i < temp; i++) {
      //       // temp[i]
      //     }
      //   }
      //
      //   return _item;
      // }
    },
    created(){
      this.tagInit()
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .over-view {
    display: flex;
    margin-bottom: 2.133333vw;
    padding: 5.333333vw 0 8vw 6.4vw;
    background-color: rgb(255, 255, 255);
  }

  .multiple-score-wrapper {
    justify-content: space-between;
    width: 33.6vw;
    align-items: center;
    color: rgb(102, 102, 102);
    display: inherit;
  }

  .multiple-score-score {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  span {
    display: inline-block;
    font-size: 1.013333rem;
    color: rgb(255, 96, 0);
  }

  }
  .multiple-score-img-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .multiple-score-title {
    font-size: .32rem;
    margin-bottom: 1.333333vw;
  }

  .multiple-score-img-item {
    position: relative;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;

  .empty-star {
    display: flex;
  }

  .filled-star {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  img {
    width: 14.933333vw;
    height: 2.666667vw;
    flex: none;
    max-width: none;
  }

  }

  .all-score-wrapper {
    flex: 1;
    justify-content: space-between;
    color: rgb(102, 102, 102);
    display: flex;
  }

  .taste-package-score {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
    padding: 0 7.2vw;
    align-items: center;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;

  span {
    font-size: .32rem;
    margin-bottom: 1.333333vw;
  }

  p {
    font-size: .533333rem;
  }

  }
  }
  .delivery-score {
    width: 22.933333vw;
    border-left: 1px solid rgb(221, 221, 221);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  span {
    font-size: .32rem;
    margin-bottom: 1.333333vw;
  }

  p {
    font-size: .533333rem;
  }

  }

  .assessment-wrapper {
    background-color: rgb(255, 255, 255);
    padding: 2.666667vw 3.2vw 0;
    font-size: .36rem;
    ul{
      padding-bottom: 2.666667vw;
      border-bottom: 1px solid rgb(238, 238, 238);
      li{
        display: inline-block;
        padding: 0 2.4vw;
        height: 7.466667vw;
        line-height: 7.466667vw;
        margin: .933333vw;
        font-size: .32rem;
        border-radius: .533333vw;
        color: rgb(109, 120, 133);
        background-color: rgb(235, 245, 255);
      &.active{
         color: rgb(255, 255, 255);
         background-color: rgb(0, 151, 255);
       }
      }
    }
  }



</style>
