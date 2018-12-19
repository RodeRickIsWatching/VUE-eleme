<template>
  <div class="wrapper" v-if="storeInfo&&storeInfo.seller">
    <div class="cover-wrapper" @click="slideFlag=false" v-show="slideFlag"></div>
    <div class="footer-activity-info-wrapper" :class="{'slide-in':slideFlag}">
      <div class="footer-activity-info"
           @click="slideFlag=!slideFlag">
      <span>{{activityInfo}}</span>
      <span style="color: rgb(255, 83, 57);">{{nextDiscountCondition}}</span>
      <span>{{otherDiscountInfo}}</span>
      </div>
      <div class="footer-cart-info-warpper">
        <div class="cart-title-wrapper">
          <div class="cart-title-container">
            <span>已选商品</span>
          </div>
          <div class="download-icon-wrapper delete-icon">
            <svg class="download-icon" aria-hidden="true">
              <use :xlink:href="iconObj['delete-icon']"></use>
            </svg>
          </div>
        </div>
        <div class="cart-item-wrapper">
          <ul class="cart-item-container">
            <li class="cart-item-item"
                v-for="(item,index) in shoppingList"
                v-if="item['foodCount']>0">
              <span class="cart-item-name-wrapper">
                <span class="cart-item-name">{{item.foodName}}</span>
              </span>
              <span class="cart-item-price-wrapper">
                <del v-if="storeInfo.goods[index[0]].foods[index[1]].oldPrice">￥{{storeInfo.goods[index[0]].foods[index[1]].oldPrice}}</del>
                <span class="cart-item-price">{{item.foodPrice}}</span>
              </span>
              <span class="cart-item-icon-wrapper">
               <v-foodCountControl :item="{_menuIndex:index[0],_foodIndex:index[1]}"></v-foodCountControl>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-cart-wrapper">
      <span class="cart-icon-wrapper"
            @click="slideFlag=!slideFlag"
            :class="{'have-goods':Object.keys(shoppingList).length>0}">
        <div class="download-icon-wrapper">
          <svg class="download-icon" aria-hidden="true">
            <use :xlink:href="iconObj['shopping-cart-icon']"></use>
          </svg>
        </div>
        <span class="mini-tag"
              v-if="menuInfo&&menuInfo.menuCount&&Object.values(menuInfo.menuCount).reduce((total,item)=>{return total+item})>0">
          {{Object.values(menuInfo.menuCount).reduce((total,item)=>{return total+item})}}</span>
      </span>
      <div class="cart-info-wrapper">
        <p class="price-info-wrapper">
          <span
            v-if="!menuInfo.menuCount||Object.values(menuInfo.menuCount).reduce((total,item)=>{return total+item})<=0">
            未选购商品
          </span>
          <span v-else>
            <span class="price-info" v-if="menuInfo&&menuInfo.menuCount&&Object.values(menuInfo.menuCount).reduce((total,item)=>{return total+item})>0">
              {{shoppingCartMsg}}
            </span>
            <del v-show="discountPrice">￥{{discountPrice}}</del>
          </span>

        </p>
        <p class="delivery-info" v-if="storeInfo">另需配送费{{storeInfo.seller.deliveryPrice}}元</p>
      </div>
      <a @click="toOrder(deliveryPriceCal)"
         class="submit-button-wrapper"
         :class="{'have-goods': deliveryPriceCal=='去结算'}">
        <span>{{deliveryPriceCal}}</span>
      </a>
    </div>
    <div class="failLoadInfo" v-if="loginFail">请先登录！</div>
  </div>
</template>

<script>
  import {mapState,mapActions} from "vuex"
  import addMinusIcon from "./addMinusIcon"
  import axios from "axios"


  export default {
    name: "storeFooter",
    data(){
      return {
        slideFlag: false,
        haveGoodFlag: false,
        activityObj: {},
        // activityInfo: ''
        nextDiscountCondition:'',
        otherDiscountInfo:'',
        discountPrice: 0,
        loginFail: false
      }
    },
    components: {
      'v-foodCountControl': addMinusIcon
    },
    computed: {
      ...mapState("storeInfos", ["storeInfo","shoppingList","menuInfo"]),
      ...mapState(["iconObj","userInfo"]),
      ...mapState("checkoutInfos", ["tempUpdate"]),
      activityInfo(){
        let str = '';
        let temp = this.storeInfo.seller.minPrice;
        let temp2 = this.menuInfo.wholePrice ? this.menuInfo.wholePrice : 0;
        this.otherDiscountInfo = '';
        this.nextDiscountCondition = '';
        if(temp2 == 0){
          for(let i in this.storeInfo.seller.supports){
            if(this.storeInfo.seller.supports[i].type==1){
              str = this.storeInfo.seller.supports[i].description;
            }
          }
        }else if(temp-temp2>0){
          str = `还差`;
          this.nextDiscountCondition = parseInt((temp-temp2)*10)/10;
          this.otherDiscountInfo = `元起送`;
          this.discountPrice = 0;
        }else{
          for(let i in this.activityObj){
            if(temp2 >= this.activityObj[i].condition){
              if(!this.activityObj[+i+1] || !(temp2-this.activityObj[i].condition)){
                str = `已减${this.activityObj[i].discount}元`;
                this.discountPrice = this.activityObj[i].discount;
                this.otherDiscountInfo = '';
                this.nextDiscountCondition = '';
                return str;
              }
              str = `已减${this.activityObj[i].discount}元，再买`;
              this.discountPrice = this.activityObj[i].discount;
              this.nextDiscountCondition = parseInt((this.activityObj[+i+1].condition - temp2)*10)/10;
              this.otherDiscountInfo = `元减${this.activityObj[+i+1].discount}元`;
            }else if(temp2 < this.activityObj[0].condition){
              str = `再买`;
              this.nextDiscountCondition = parseInt((this.activityObj[0].condition - temp2)*10)/10;
              this.otherDiscountInfo = `元减${this.activityObj[0].discount}元`;
            }
          }
        }
        return str;
      },
      deliveryPriceCal(){
        let str = '';
        let temp = this.storeInfo.seller.minPrice;
        let temp2 = this.menuInfo.wholePrice ? this.menuInfo.wholePrice : 0;
        if(temp2==0){
          str = `￥${temp}起送`;
        }else if(temp-temp2>0){
          str = `还差￥${parseInt((temp-temp2)*10)/10}起送`;
        }else{
          str = "去结算";
        }
        return str
      },
      shoppingCartMsg(){
      let temp = '￥'+ parseInt((+this.menuInfo.wholePrice - this.discountPrice)*10)/10;
      this.$store.state.storeInfos.menuInfo.discountPrice = this.discountPrice;
      return temp;
      }
    },
    methods:{
      ...mapActions("storeInfos", ["getStorageInfo"]),
      ...mapActions("checkoutInfos", ["getCheckOutInfo","downloadCheckOutInfo"]),
      renderActivityInfo(){
        let tempArr = [];
        for(let i in this.storeInfo.seller.supports){
          if(this.storeInfo.seller.supports[i].type==1){
            let tempStr = this.storeInfo.seller.supports[i].description;
            tempArr = tempStr.split("，");
            for(let i = 0; i < tempArr.length; i++){
              this.activityObj[i] = {};
              this.activityObj[i]["condition"] = tempArr[i].split("满")[1].split("减")[0];
              this.activityObj[i]["discount"] = tempArr[i].split("减")[1].split("元")[0];
            }
          }
        }
      },
      toOrder(_statement){
        //跳转订单信息页面
        if(this.userInfo){
          if(_statement == "去结算"){
            //上传数据
            this.getCheckOutInfo();
            let a = new Promise((response)=>{
              axios.post("/checkOutUp", this.tempUpdate)
                .then(res=>{
                  response(res.statusText)
                })
            });
            //上传完毕后跳转
            a.then((res)=>{
              if(res.toUpperCase() == "OK"){
                axios.get("/checkOut")
                  .then((res)=>{
                    this.downloadCheckOutInfo(res.data.data);
                    this.$router.push({name:'checkOut'})
                  });
              }
            })
          }
        }else{
          this.loginFail = true;
          let timer = setTimeout(()=>{
            clearTimeout(timer);
            this.loginFail = false;
          },4000)
        }
      }
    },
    created(){
      this.renderActivityInfo();
      this.otherDiscountInfo = '';
      this.nextDiscountCondition = '';
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .failLoadInfo{
    position: absolute;
    top: 33.333%;
    right: 30%;
    border: 1px solid #8e8e93;
    border-radius: 12vw 12vw;
    text-align: center;
    width: 40vw;
    height: 10vw;
    line-height: 10vw;
    background-color: #8e8e93;
    color: #fff;
    animation: fade 4s linear forwards;
  }
  @keyframes fade {
    0%{
      opacity: 0;
    }
    10%{
      opacity: 1;
    }
    90%{
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }

  .wrapper {
    font-size: .426667rem;
  }

  .cover-wrapper {
    z-index: 10;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    transition: opacity .3s ease;
  }

  .footer-activity-info-wrapper {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: rgb(255, 255, 255);
    transition: transform .3s ease;
    transform: translate3d(0, 100%, 0);
    bottom: 18.133333vw;
    z-index: 11;
    &.slide-in{
       transform: translateZ(0);
       bottom: 12.8vw;
     }
  }

  .footer-activity-info {
    background-color: rgb(255, 250, 214);
    border-top: .013333rem solid rgb(249, 232, 163);
    border-top: .133333vw solid rgb(249, 232, 163);
    opacity: .96;
    line-height: 5.333333vw;
    font-size: .266667rem;
    text-align: center;
  }

  .footer-cart-wrapper {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 21.066667vw;
    background-color: rgba(77, 77, 77, 1);
    height: 12.8vw;
    z-index: 11;
  }

  .cart-icon-wrapper {
    position: absolute;
    left: 3.2vw;
    bottom: 2vw;
    width: 13.333333vw;
    height: 13.333333vw;
    box-sizing: border-box;
    border-radius: 100%;
    background-color: rgb(54, 54, 54);
    border: 1.333333vw solid rgb(68, 68, 68);
    color: rgb(88, 88, 88);
    box-shadow: 0 -0.8vw 0.533333vw 0 rgba(0, 0, 0, .1);
    text-align: center;
    line-height: 10.333333vw;
    z-index: 10;
    &.have-goods {
       background-color: rgb(49, 144, 232);
       color: #fff;
     }
  }



  .download-icon-wrapper {
    display: inline-block;
    font-size: 0.7rem;
  }

  .mini-tag {
    position: absolute;
    right: -1.2vw;
    top: -1.333333vw;
    line-height: 1;
    background-image: linear-gradient(-90deg, rgb(255, 116, 22), rgb(255, 60, 21) 98%);
    color: rgb(255, 255, 255);
    border-radius: 3.2vw;
    padding: .533333vw 1.333333vw;
    font-size: .266667rem;
  }

  .cart-info-wrapper {
    flex: 1;
  }

  .submit-button-wrapper{
    height: 100%;
    width: 28vw;
    background-color: rgb(83, 83, 86);
    color: rgb(255, 255, 255);
    text-align: center;
    text-decoration: none;
    font-size: .4rem;
    font-weight: 700;
    -webkit-user-select: none;
    user-select: none;
    line-height: 12.8vw;
    &.have-goods{
      background-color: rgb(56, 202, 115);
    }
  }
  .price-info-wrapper{
    font-size: .35rem;
    color: rgb(153, 153, 153);
    line-height: normal;
    height: 5vw;
    span{
      line-height: 5vw;
    }
  }
  .price-info{
    font-size: 0.5rem;
    color: #fff;
  }
  .delivery-info{
    color: rgb(153, 153, 153);
    font-size: .266667rem;
  }

  .cart-title-wrapper{
    display: flex;
    align-items: center;
    padding: 0 4vw;
    border-bottom: .133333vw solid rgb(189, 189, 189);
    background-color: rgb(236, 239, 241);
    color: rgb(102, 102, 102);
    height: 10.666667vw;
  }
  .cart-title-container{
    flex: 1;
    display: flex;
    align-items: center;
  }

  .delete-icon{
    flex: none;
    display: flex;
    align-items: center;
    padding-left: 4vw;
    color: rgb(102, 102, 102);
    font-size: .346667rem;
    line-height: 4vw;
  }
  .cart-item-wrapper{
    overflow: auto;
    max-height: 80vw;
    li{
      display: flex;
      align-items: center;
      padding: 2vw 3.333333vw 2vw 0;
      min-height: 14.666667vw;
      margin-left: 3.333333vw;
    }
  }
  .cart-item-name-wrapper{
    flex: 5.5;
    line-height: normal;
  }
  .cart-item-name{
    display: inline-block;
    font-style: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    max-width: 46.666667vw;
  }
  .cart-item-price-wrapper{
    flex: 2.5;
    color: rgb(255, 83, 57);
    text-align: right;
    white-space: nowrap;
    font-weight: 700;
    del{
      margin-right: 1.333333vw;
      font-size: .266667rem;
      color: rgb(153, 153, 153);
      font-weight: 400;
    }
    .cart-item-price::before{
      content: "￥";
      font-size: .266667rem;
      color: currentColor;
    }
  }
  .cart-item-icon-wrapper{
    flex: 3;
    text-align: right;
    font-size: .4rem;
    span{
      display: inline-block;
      vertical-align: 5px;
    }
    .download-icon-wrapper{
      color: rgb(35, 150, 255);
      font-size: 0.7rem;
    }
  }


</style>
