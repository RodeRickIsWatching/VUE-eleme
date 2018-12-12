<template>
  <div class="wrapper">
    <div class="hasContentSignal" @click="ifClicked=!ifClicked">
      <div class="download-icon-wrapper" :style="{color: ifClicked ? 'rgb(118, 213, 114)': 'rgb(232, 232, 232)'}">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['logo-icon']"></use>
        </svg>
      </div>
      只看有内容的评价
    </div>
    <ul v-if="storeInfo&&storeInfo.ratings&&storeInfo.ratings.ratingInfos&&storeInfo.ratings.ratingInfos">
      <li v-for="(item,index) in storeInfo.ratings.ratingInfos"
          v-if="item.rateType.includes(+nowTag)">
        <div class="user-ratings-info-wrapper">
          <div class="head-img-wrapper">
            <span v-lazy:background-image="{src: require('../../../assets/register-logo.png')}"></span>
          </div>
          <div class="ratings-content-wrapper">
            <div class="username-wrapper">
              <span>{{item.username}}</span>
              <span class="date-info">
                {{new Date(item.rateTime).getFullYear()}}-{{new Date(item.rateTime).getMonth()+1}}-{{new Date(item.rateTime).getDate()}}
              </span>
            </div>
            <div class="score-info-wrapper">
              <div class="score-info-container">
                <div class="empty-star">
                  <img src="../../../assets/empty-star.svg">
                </div>
                <div class="filled-star" :style="{width:item.score/5*100+'%'}">
                  <img src="../../../assets/filled-star.svg">
                </div>
              </div>
              <span class="tag">{{tagCal(item.score)}}</span>
            </div>
            <div class="user-ratings-wrapper">
              <span>{{item.text}}</span>
              <mark v-if="item.compliment" v-for="(item2,index2) in item.compliment">{{item2}}</mark>
            </div>
            <div class="seller-reply-wrapper" v-if="item.reply">商家回复：{{item.reply}}</div>
            <ul class="food-img-wrapper" v-if="item.avatar">
              <li v-for="(item2,index2) in item.avatar">
                <img :src="item2">
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState, mapAction} from "vuex"

  export default {
    name: "ratingBodyComponent",
    props: ["nowTag"],
    data(){
      return {
        ifClicked: false
      }
    },
    computed: {
      ...mapState("storeInfos", ["storeInfo"]),
      ...mapState(["iconObj"]),
    },
    methods:{
      tagCal(_score){
        if(_score <= 5 && _score > 4){
          return "超赞"
        }else if(_score <= 4 && _score > 3){
          return "满意"
        }else if(_score <= 3 && _score > 2){
          return "一般"
        }else if(_score <= 2 && _score > 1){
          return "吐槽"
        }else if(_score <= 1 && _score > 0){
          return "不满意"
        }
      }
    },
    created() {
      console.log(this.nowTag)
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .hasContentSignal{
    display: flex;
    align-items: center;
    padding-left: 4vw;
    height: 10.666667vw;
    color: rgb(102, 102, 102);
    border-bottom: .133333vw solid rgb(238, 238, 238)
  }

  li{
    padding: 4vw 0 3.2vw;
    border-bottom: .133333vw solid rgb(238, 238, 238);
  }
  .user-ratings-info-wrapper{
    position: relative;
    padding-left: 10.666667vw;
    .head-img-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
      span{
        background-position: 0px 180px;
        background-size: 60px;
        display: inline-block;
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
  }
  .ratings-content-wrapper{
    font-size: .346667rem;
    .username-wrapper{
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        font-size: .346667rem;
        margin-top: 0;
        color: rgb(51, 51, 51);
        margin-right: 1.6vw;
      }
      .date-info{
        font-size: .293333rem;
        color: rgb(153, 153, 153);
      }
    }
  }
  .score-info-wrapper{
    display: flex;
    align-items: center;
    margin: 1.6vw 0 .533333vw;
    .score-info-container{
      position: relative;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      .empty-star{
          display: flex;
        img{
          width: 14.933333vw;
          height: 2.666667vw;
          flex: none;
          max-width: none;
        }
      }
      .filled-star{
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        img{
          width: 14.933333vw;
          height: 2.666667vw;
          flex: none;
          max-width: none;
        }
      }
    }
  }
  .tag{
    color: rgb(251, 154, 11);
    font-size: .293333rem;
    margin-left: 1.066667vw;
  }
  .user-ratings-wrapper{
    span{
      display: inline-block;
      color: rgb(51, 51, 51);
      font-size: .373333rem;
      margin: 2.133333vw 0;
    }
    mark{
      background-color: rgba(0, 0, 0, 0);
      color: rgb(80, 130, 177);
    }
  }
  .seller-reply-wrapper{
    position: relative;
    margin: 2.666667vw 0;
    padding: 2.666667vw;
    background: rgb(243, 243, 243);
    border-radius: 1.066667vw;
    &::after{
       content: " ";
       position: absolute;
       bottom: 100%;
       left: 4vw;
       width: 0;
       height: 0;
       border-style: solid;
       border-width: 0 2.133333vw 2.133333vw;
       border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgb(243, 243, 243);
     }
  }
  .food-img-wrapper{
    margin-top: 1.066667vw;
    margin-bottom: 3.2vw;
    li{
      display: inline-block;
      margin: 0 .533333vw;
      img{
        width: 40vw;
        height: 40vw;
      }
    }
  }
</style>
