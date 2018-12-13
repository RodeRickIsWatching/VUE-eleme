<template>
  <div class="wrapper">
    <div class="header">
      <div class="backIcon download-icon-wrapper" @click="goBack()">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
      <h1 class="header-info">确认订单</h1>
    </div>
    <div class="check-out-wrapper">
      <div class="main-info-wrapper">
        <div class="cart-address-wrapper">
          <div class="cart-address-item" v-if="orderedLocation">
            <div class="title">
              <span>订单配送至</span>
            </div>
            <div class="address-info">
              <span class="address-item">{{orderedLocation.defaultLocation}}</span>
            </div>
            <div class="user-info">
              <span>{{orderedLocation.orderedName}}</span>
              <span>(先生)</span>
              <span class="user-phone">{{orderedLocation.orderedPhone}}</span>
            </div>
          </div>
        </div>
        <div class="key-card-wrapper checkout-box">
          <section class="one-px-solid">
            <div class="key-card-item delivery-time-wrapper">
              <div class="title">
                <div class="left-item">
                  <span>送达时间</span>
                </div>
              </div>
              <div class="option">
                <div class="right-item" v-if="storeInfo&&storeInfo.seller">
                  <span>尽快送达({{timeCal}})送达</span>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div class="key-card-item pay-way">
              <div class="title">
                <div class="left-item">
                  <span>支付方式</span>
                </div>
              </div>
              <div class="option">
                <div class="right-item">
                  <span>在线支付</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="check-out-info-wrapper checkout-box">
          <div class="store-name-wrapper one-px-solid" v-if="checkOutInfo && checkOutInfo.storeName">
            <span v-if="checkOutInfo.storeName.split('（')[1]">
              <span>{{checkOutInfo.storeName.split('（')[0]}}</span>
              <span>（{{checkOutInfo.storeName.split('（')[1]}}</span>
            </span>
            <span v-else>{{checkOutInfo.storeName}}</span>
          </div>
          <ul class="food-bill-wrapper" v-if="checkOutInfo">
            <li v-for="(item,index) in checkOutInfo.foodList" class="one-px-solid">
              <img src="../../assets/good-info.webp">
              <div class="food-name">
                <span>{{item.foodName}}</span>
              </div>
              <span class="food-quantity">
                <span>x {{item.foodCount}}</span>
              </span>
              <span class="food-price">
                <span>￥</span>
                <span>{{item.foodPrice}}</span>
              </span>
            </li>
          </ul>
          <ul class="other-bill-wrapper">
            <li class="one-px-solid"></li>
          </ul>
          <div class="red-pocket-info-wrapper one-px-solid">
            <div>
              <span>红包</span>
            </div>
          </div>
          <div class="in-all-bill-wrapper one-px-solid" v-if="checkOutInfo">
            <div class="in-all-bill-item">
              <div class="left-info">
                <span>优惠说明</span>
              </div>
              <div class="right-info">
                小计 ￥<span>{{parseInt((+checkOutInfo.wholePrice - checkOutInfo.discountPrice)*10)/10}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="recommendation-info-wrapper one-px-solid"></div>-->
        <div class="other-select-wrapper checkout-box">
          <div class="table-ware-wrapper cart-item">
            <div class="table-ware-wrapper">
              <div class="table-ware-container">
                <div class="left-title">餐具份数</div>
                <div class="right-info">未选择</div>
              </div>
              <div class="additional">
                <span>马上助力环保</span>
              </div>
            </div>
          </div>
          <div class="notes-wrapper cart-item">
            <div class="left-title">订单备注</div>
            <div class="right-info">口味、偏好</div>
          </div>
          <div class="invoice-wrapper cart-item">
            <div class="left-title">发票信息</div>
            <div class="right-info">暂不支持</div>
          </div>
          <div class="mobile-protection-wrapper cart-item">
            <div>
              <div class="mobile-protection-item">号码保护</div>
            </div>
            <span>号码保护中，将对商家、骑手隐藏您的真实手机号</span>
          </div>
        </div>
      </div>
      <div class="footer-info-wrapper" v-if="checkOutInfo">
        <span>￥{{parseInt((+checkOutInfo.wholePrice - checkOutInfo.discountPrice)*10)/10}}</span>
        <small> | 已优惠￥{{checkOutInfo.discountPrice}}</small>
        <button type="button" @click="toPay()">去支付</button>
      </div>
    </div>


  </div>
</template>

<script>
  import {mapState,mapActions} from "vuex"
  import loadingAnimation from "../utilsComponents/loadingAnimation"
  import axios from "axios"

  export default {
    name: "checkOut",
    computed: {
      ...mapState(["iconObj","orderedLocation"]),
      ...mapState("checkoutInfos",["checkOutInfo"]),
      ...mapState("storeInfos", ["menuInfo","storeInfo","shoppingList"]),
      timeCal(){
        let str = '';
        let hours = new Date(new Date().getTime()+(this.storeInfo.seller.deliveryTime*60*1000)).getHours();
        let minutes = new Date(new Date().getTime()+(this.storeInfo.seller.deliveryTime*60*1000)).getMinutes();
        if(hours < 10){
          hours = '0' + hours;
        }
        if(minutes < 10){
          minutes = '0' + minutes;
        }
        str =  hours + ":" + minutes;
        return str;
      }
    },
    components:{
      "v-loading": loadingAnimation
    },
    methods:{
      toPay(){
        let temp = JSON.parse(window.localStorage.getItem("ordered")) ? JSON.parse(window.localStorage.getItem("ordered")):{};
        temp[this.checkOutInfo.time] = this.checkOutInfo;
        temp = JSON.stringify(temp);
        window.localStorage.setItem("ordered",temp);
        window.sessionStorage.removeItem("storeInfo");
        alert("已下单，配送中");
        this.$router.push('/home');
      },
      goBack() {
        this.$router.go(-1);
      },
      ...mapActions("checkoutInfos",["downloadCheckOutInfo"])
    },
    created(){
      // this.$nextTick(()=>{
        axios.get("/checkOut")
          .then((res)=>{
              this.downloadCheckOutInfo(res.data.data);
          });
      // })
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  @import "../../style/utils.scss";

  .one-px-solid{
    position: relative;
    &::after{
       content: '';
       display: block;
       width: 100%;
       border-bottom: 1px solid rgba(0,0,0,0.1);
       position: absolute;
       bottom: 0px;
     }
  }

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

  .check-out-wrapper{
    position: relative;
    font-size: .373333rem;
    color: rgb(51, 51, 51);
    padding-bottom: 14.133333vw;
    padding-left: 1.6vw;
    padding-right: 1.6vw;
    background-image: linear-gradient(0deg,rgb(245, 245, 245),rgb(245, 245, 245) 65%,rgba(245, 245, 245, 0.3) 75%,rgba(245, 245, 245, 0)),linear-gradient(270deg,rgb(0, 133, 255),rgb(0, 170, 255));
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    /*width: 100%;*/
    height: 100%;
  }
  section:not(:last-child)::after{
    content: '';
    display: block;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  .cart-address-wrapper{
    background-color: rgba(0, 0, 0, 0);
    padding: 4.266667vw 0 0;
    min-height: 22.133333vw;
    display: flex;
    align-items: center;
    justify-content: center;
    .cart-address-item{
      flex: 0 100%;
      padding: 0 2.133333vw;
      position: relative;
      color: rgb(255, 255, 255);
      overflow: hidden;
      .title{
        font-size: .373333rem;
        line-height: 1.21;
        color: rgba(255, 255, 255, 0.8);
        span{
          vertical-align: middle;
        }
      }
    }
  }

  .address-info{
    font-size: .453333rem;
    font-weight: 700;
    line-height: 1.88;
    overflow: hidden;
    display: flex;
    align-items: center;
    .address-item{
      font-size: .586667rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: calc(100% - 4vw);
    }
  }

  .user-info{
    font-size: .373333rem;
    line-height: 1.21;
    margin-bottom: 1.333333vw;
    .user-phone{
      margin-left: 2.133333vw;
    }
  }
  .checkout-box{
    background: rgb(255, 255, 255);
    box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0,0,0,.05);
    &:not(:last-child){
       margin-bottom: 2.133333vw;
     }
  }

  .key-card-wrapper{
    padding: 0 5.333333vw;
    .key-card-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dotted rgb(238, 238, 238);
      padding: 4.266667vw 0;
      .title{
        flex: 1;
        .left-item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: .4rem;
          font-weight: 500;
        }
      }
      .option{
        text-align: right;
        .right-item{
          text-align: right;
          color: rgb(35, 149, 255);
        }
      }
    }
  }
  .pay-way{
    font-size: .4rem;
  }

  .store-name-wrapper{
    padding: 4.266667vw 0;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    z-index: 1;
    color: rgb(51, 51, 51);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-size: 4px;
    span{
      display: inline-block;
      vertical-align: middle;
      font-size: .453333rem;
      line-height: 1;
      font-weight: 700;
    &:nth-child(2){
       margin-left: -1.333333vw;
       font-size: .346667rem;
       line-height: 1.15;
       font-weight: 500;
     }
    }
  }

  .check-out-info-wrapper{
    padding: 0 5.333333vw;
  }
  ul{
    margin-top: .666667vw;
    color: rgb(51, 51, 51);
    font-size: .346667rem;
  }
  li{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 3.2vw 0;
    border-bottom: 1px dotted rgb(238, 238, 238);
    font-size: .373333rem;
    color: inherit;
    img{
      width: 9.6vw;
      height: 9.6vw;
    }
    .food-name{
      margin-left: 2.133333vw;
      overflow: hidden;
      flex: 5;
    }
    .food-quantity{
      flex: 1;
      text-align: right;
      font-size: .32rem;
    }
    .food-price{
      font-size: .426667rem;
      flex: 3;
      text-align: right;
      span:nth-child(1){
        font-size: .32rem;
        margin-right: -2vw;
      }
    }
  }

  .red-pocket-info-wrapper{
    display: flex;
    padding: 4.266667vw 0;
    border-top-width: 0!important;
    border-bottom-width: 0!important;
    overflow: hidden;
    span{
      display: inline;
      font-size: .373333rem;
      font-weight: 500;
      color: rgb(51, 51, 51);
    }
  }

  .in-all-bill-wrapper{
    padding: 4vw 0 4.8vw;
    .in-all-bill-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .373333rem;
      color: rgb(51, 51, 51);
      .left-info{
        text-align: right;
        display: flex;
        align-items: center;
        color: rgb(187, 187, 187);
        font-size: .346667rem;
      }
      .right-info{
        span{
          font-size: .586667rem;
          font-weight: 500;
        }
      }
    }
  }

  .cart-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4.266667vw 5.333333vw;
    font-size: .4rem;
    color: rgb(51, 51, 51);
    .left-title{
      font-weight: 500;
    }
    .right-info{
      display: flex;
      align-items: center;
      color: rgb(187, 187, 187);
      font-size: .346667rem;
      max-width: 69.333333vw;
    }
  }

  .table-ware-wrapper{
    flex: 1;
  }

  .table-ware-container{
    justify-content: space-between;
    display: flex;
    align-items: center;
  }
  .additional{
    margin-right: 1.333333vw;
    margin-top: 2.133333vw;
    color: rgb(11, 180, 115);
    display: flex;
    align-items: center;
    font-size: .32rem;
  }

  .notes-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4.266667vw 5.333333vw;
    font-size: .4rem;
    color: rgb(51, 51, 51);
  }
  .mobile-protection-wrapper{
    flex-direction: column;
    align-items: initial;
    justify-content: initial;
    span{
      font-size: .293333rem;
      line-height: 1.36;
      color: rgb(153, 153, 153);
      margin-top: 2.666667vw;
    }
  }

  .footer-info-wrapper{
    height: 11.733333vw;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgb(60, 60, 60);
    z-index: 2;
    span{
      color: rgb(255, 255, 255);
      font-size: .48rem;
      line-height: 11.733333vw;
      padding-left: 2.666667vw;
      vertical-align: middle;
    }
    small{
      color: rgb(153, 153, 153);
      font-size: .32rem;
      vertical-align: middle;
    }
    button{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgb(0, 224, 103);
      min-width: 28vw;
      padding: 0 1.333333vw;
      border: none;
      color: rgb(255, 255, 255);
      font-size: .453333rem;
    }
  }
</style>
