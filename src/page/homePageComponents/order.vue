<template>
  <div id="wrapper">
    <div class="header">
      <div class="backIcon download-icon-wrapper" @click="goBack()">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
      <div class="header-info">订单</div>
    </div>

    <div ref="orderScroll" class="wrapper">
      <div v-if="orderedInfo.length > 0 && showArr.length > 0">
      <div class="order-wrapper"  v-for="(item,index) in showArr">
          <div class="order-info">
            <div class="store-logo">
              <img src="../../assets/store0-logo.webp">
            </div>
            <div class="store-content">
              <div class="store-content-head">
                <div class="title">
                  <div class="store-name">
                    <span>{{item.storeName}}</span>
                  </div>
                  <div class="delivery-statement">订单已送达</div>
                </div>
                <div class="date-time">{{timeCal(item)}}</div>
              </div>
              <div class="store-content-detail">
                <div class="food-list">
                  <span>{{item.foodList[Object.keys(item.foodList)[0]].foodName}}等{{item.totalQuantity}}件商品</span>
                </div>
                <div class="whole-price">￥{{parseInt((item.wholePrice-item.discountPrice)*10)/10}}</div>
              </div>
            </div>
          </div>
          <div class="order-bottom">
            <button type="button" class="card-button">再来一单</button>
            <button type="button" class="card-button comment">评价得金币</button>
          </div>
        </div>
        <div class="show-more" v-if="ifScrollOver">
          <div class="loading">
            <div class="download-icon-wrapper">
              <svg class="download-icon" aria-hidden="true">
                <use :xlink:href="iconObj['loading-icon']"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex"
  import axios from "axios"
  import BS from "better-scroll"

  export default {
    name: "order",
    data(){
      return {
        orderedInfo: {},
        orderScroll: null,
        ifScrollOver: false,
        showNum: 10,
        showArr: [],
        defaultNum: 5,
      }
    },
    computed: {
      ...mapState(["iconObj", "orderedLocation"]),
      ...mapState("checkoutInfos", ["checkOutInfo"]),
    },
    methods:{
      ...mapActions("checkoutInfos",["downloadCheckOutInfo"]),
      showOrder(){
        let temp = 0;
        if(this.orderedInfo.length >= this.defaultNum && this.showArr.length >= this.defaultNum){
          for(let i = this.showNum; i < this.showNum+3; i++){
            if(this.orderedInfo[i]){
              temp++;
              this.showArr.push(this.orderedInfo[i])
            }
          }
          this.showNum = this.showNum + temp;
        }else{
          for(let i = 0; i < this.defaultNum; i++){
            this.showArr.push(this.orderedInfo[i])
          }
        }
      },
      timeCal(_item){
        let nowDuration = new Date().getTime();
        let duration = nowDuration - _item.time;
        if(duration > 1000*3600*24){
          return  `${new Date(_item.time).getFullYear()}-${new Date(_item.time).getMonth()+1}-${new Date(_item.time).getDate()}  ${new Date(_item.time).getHours()}:${new Date(_item.time).getMinutes()}`
        }else{
          let tempHour = new Date(nowDuration).getHours()-new Date(_item.time).getHours();
          let tempMinute = new Date(nowDuration).getMinutes()-new Date(_item.time).getMinutes();
          if(tempMinute<0){
            tempMinute = 60 + tempMinute;
            tempHour -= 1;
          }
          return `${tempHour}小时${tempMinute}分钟前`
        }
      },
      BSInit(){
        this.orderScroll = new BS(this.$refs.orderScroll,{
          click: true,
          scrollY: true,
          probeType: 3,
          bounce: {
            top: false,
            bottom: false,
            left: false,
            right: false
          },
          pullUpLoad: {
            threshold: 100
          },
        });

        this.orderScroll.on("pullingUp",()=>{
          if(this.orderedInfo.length == this.showArr.length){
            this.ifScrollOver = false;
          }else{
            this.ifScrollOver = true;
            setTimeout(()=>{
              //数据更新
              this.showOrder();
              this.$nextTick(()=>{
                //关闭loading、重新计算、关闭上拉加载
                this.ifScrollOver = false;
                this.orderScroll.refresh();
                this.orderScroll.finishPullUp();
              });
            },3000);
          }
        })
      }
    },
    created(){
      this.$nextTick(()=>{
        axios.get("/ordered")
          .then((res)=>{
            let result = res.data.data;
            let tempArr = [];
            for(let i in result){
              tempArr.unshift(result[i])
            }
            this.orderedInfo = tempArr;
            this.showOrder();

            let a = new Promise(res=>{
              if(this.orderedInfo.length>0){
                res();
              }
            });

            a.then(res=>{
              this.BSInit();
              this.orderScroll.refresh();
            })

          });

      })
    },
  }
</script>

<style scoped lang="scss" type="text/css">
  @import "../../style/utils.scss";

  .header {
    width: 100%;
    color: #fff;
    height: 1.173333rem;
    line-height: 1.173333rem;
    position: sticky;
    top: 0px;
    z-index: 3;
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));
    margin-bottom: -1vw;
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


  .order-wrapper{
    display: block;
    margin-top: 2.666667vw;
    background-color: rgb(255, 255, 255);
    padding: 3.733333vw 0 0 4vw;
    .order-info{
      display: flex;
      .store-logo{
        display: inline-block;
        padding-right: 2.666667vw;
        flex: none;
        img{
          border-radius: .533333vw;
          border: 1px solid rgb(238, 238, 238);
          width: 8.533333vw;
          height: 8.533333vw;
        }
      }
      .store-content{
        flex: 1;
        .store-content-head{
          border-bottom: 1px solid rgb(238, 238, 238);
          padding-right: 3.466667vw;
          padding-bottom: 2.666667vw;
          .title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .store-name{
              display: flex;
              align-items: center;
              font-size: .426667rem;
              line-height: 1.5em;
              color: rgb(51, 51, 51);
              span{
                display: inline-block;
                max-width: 10em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .delivery-statement{
              font-size: .346667rem;
              text-align: right;
              color: rgb(51, 51, 51);
              max-width: 10em;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .date-time{
            font-size: .293333rem;
            color: rgb(153, 153, 153);
          }
        }
      }
    }
  }

  .store-content-detail{
    display: flex;
    justify-content: space-between;
    padding: 4vw 3.466667vw 4vw 0;
    .food-list{
      font-size: .346667rem;
      color: rgb(102, 102, 102);
      display: flex;
      align-items: center;
      span{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 42.666667vw;
      }
    }
    .whole-price{
      flex-basis: 16.000000vw;
      text-align: right;
      font-size: .346667rem;
      color: rgb(51, 51, 51);
      font-weight: 700;
    }
  }

  .order-bottom{
    display: flex;
    border-top: 1px solid rgb(238, 238, 238);
    padding: 2.666667vw 4.266667vw;
    justify-content: flex-end;
    .card-button{
      padding: 1.333333vw 2.666667vw;
      border: 1px solid rgb(35, 149, 255);
      border-radius: .533333vw;
      background-color: rgba(0, 0, 0, 0);
      outline: none;
      font-size: .346667rem;
      color: rgb(35, 149, 255);
      margin-left: 2vw;
    }
    .comment{
      color: rgb(255, 83, 57);
      border-color: rgb(255, 83, 57);
    }
  }

  .wrapper{
    margin-bottom: 15vw;
    height: 1140px;
    overflow: hidden;
  }

  .show-more{
    padding: 2vw 0;
    .loading{
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: rgb(153, 153, 153);
      .download-icon-wrapper{
        font-size: 0.6rem;
        animation: loading 2s linear infinite;
      }
    }
  }

  @keyframes loading {
    0%{
      transform: rotateZ(0deg);
    }
    100%{
      transform: rotateZ(360deg);
    }
  }



</style>
