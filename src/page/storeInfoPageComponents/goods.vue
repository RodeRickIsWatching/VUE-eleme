<template>
  <div class="wrapper">
    <div class="goods-wrapper">
      <div class="goods-container">
        <div class="goods-item" v-if="storeInfo">
          <div class="left-nav-wrapper" ref="leftWrapper">
              <ul>
                <li v-for="(item,index) in storeInfo.goods"
                    :class="{active:nowIndex==index}"
                    @click="clicked(index)"
                    v-if="storeInfo">
                  <img :src="pics[index]" v-if="pics[index]">
                  <span v-if="menuInfo.menuCount&&menuInfo.menuCount[index]>0" class="mini-tag">{{menuInfo.menuCount[index]}}</span>
                  <span v-if="storeInfo">{{item.name}}</span>
                </li>
              </ul>
          </div>
          <div class="right-menu-wrapper" ref="rightWrapper">
            <ul>
              <li v-for="(item,index) in storeInfo.goods" v-if="storeInfo">
                <div class="right-menu-container">
                  <div class="title-wrapper">
                    <span class="title-name">{{item.name}}</span>
                    <span class="title-des">{{item.description}}</span>
                  </div>
                  <div class="goods-info-wrapper" v-if="item.foods" v-for="(item2,index2) in item.foods">
                    <div class="goods-info-container">
                      <div class="goods-img-container">
                        <span>
                          <!--<img src="../../assets/good-info.webp">-->
                          <img v-lazy="require('../../assets/good-info.webp')">
                        </span>
                      </div>
                      <div class="goods-item-container">
                        <div class="goods-name"><span>{{item2.name}}</span></div>
                        <div class="goods-des"><span>{{item2.description}}</span></div>
                        <div class="goods-sale-info">
                          <span>月售{{item2.sellCount}}份</span>
                          <span>好评率{{item2.rating}}%</span>
                        </div>
                        <div class="goods-discount">
                          <div v-if="item2.oldPrice">
                              <span class="discount-tag">
                                {{(item2.price/item2.oldPrice*10).toFixed(1)}}折
                              </span>
                            <span>每单限1份优惠</span>
                          </div>
                        </div>
                        <div class="goods-price">
                          <span class="now-price">{{item2.price}}</span>
                          <span class="old-price" v-if="item2.oldPrice">{{item2.oldPrice}}</span>
                        </div>
                        <div class="goods-icon-wrapper">
                            <span class="goods-icon-container">
                              <v-foodCountControl :item="{_menuIndex:index,_foodIndex:index2}"></v-foodCountControl>
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!storeInfo">
      <v-loading></v-loading>
    </div>

    <v-storeFooter></v-storeFooter>
  </div>
</template>

<script>
  import {mapState,mapActions} from "vuex"
  import addMinusIcon from "./addMinusIcon"
  import loadingAnimation from "../utilsComponents/loadingAnimation"
  import storeFooter from "../storeInfoPageComponents/storeFooter"
  import BS from "better-scroll"

  export default {
    name: "order",
    data() {
      return {
        pics: [require("../../assets/hot-selling.webp"), require("../../assets/sale-selling.webp")],
        clickedItem: 0,
        leftScroll: {},
        rightScroll: {},
        scrollHeightArr1:[],
        scrollHeightArr:[],
        nowIndex:0,
        scrollY:0,
        menuTag:{}
      }
    },
    components:{
      'v-foodCountControl': addMinusIcon,
      'v-loading': loadingAnimation,
       "v-storeFooter": storeFooter,
    },
    computed: {
      ...mapState("storeInfos", ["storeInfo","shoppingList","menuInfo"]),
      ...mapState(["iconObj"]),
    },
    methods: {
      ...mapActions("storeInfos", ["getStorageInfo"]),
      clicked(_index) {
        this.clickedItem = _index;
        this.nowIndex = this.clickedItem;
        let goodLists = this.$refs.rightWrapper.getElementsByTagName("li");
        this.rightScroll.scrollToElement(goodLists[_index],300);
      },
      BSInit() {
        //创建scrollHeightObj的高度目录
        //目录有问题，有元素不足一页
        this.scrollHeightArr = [0];
        let temp = this.$refs.rightWrapper.getElementsByTagName("li");
        let tempHeight = 0;
        for(let i = 0; i < temp.length-1; i++){
          tempHeight -= temp[i].clientHeight-50;
          this.scrollHeightArr.push(tempHeight);
        }

        //better-scroll初始化
        this.leftScroll = new BS(this.$refs.leftWrapper, {
          click: true,
          scrollY: true,
          bounce: {
            top: true,
            bottom: false,
            left: false,
            right: false
          }
        });

        this.rightScroll = new BS(this.$refs.rightWrapper, {
          click: true,
          scrollY: true,
          mouseWheel: true,
          bounce: {
            top: true,
            bottom: false,
            left: false,
            right: false
          },
          probeType: 3
        });

        this.rightScroll.on("scrollEnd",(pos)=>{
          this.scrollY = pos.y;
          this.calScrollY(this.scrollY);
        })
      },
      calScrollY(newVal){
        if (newVal > 0) {
          this.nowIndex = 0;
          return
        }

        for (let i = 0; i < this.scrollHeightArr.length; i++) {
          let height1 = this.scrollHeightArr[i];
          let height2 = this.scrollHeightArr[i + 1];
          if(height1&&!height2){
            this.nowIndex = i;
            return ;
          }else{
            if (-newVal >= height1 && -newVal < -height2) {
              this.nowIndex = i;
              return ;
            }
          }
        }
        // this.nowIndex = this.scrollHeightArr.length - 2;
      },
      handleDefferInfo(){
        let timer = null;
        let a = new Promise((resolve, reject) => {
            if(Object.keys(this.storeInfo).length > 0){
              clearTimeout(timer);
              resolve(self);
            }else{
              clearTimeout(timer);
              reject(self);
            }
        });
        a.then(resolve=>{
          clearTimeout(timer);
          this.$nextTick(()=>{
            this.BSInit();
            this.rightScroll.refresh();
          })
        });
        a.catch(reject=>{
          timer = setTimeout(()=>{
            console.log("1s后尝试再次获取");
            this.handleDefferInfo();
          },1000)
        })
      }
    },
    created() {
      //初始化betterScroll
        this.handleDefferInfo();
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .wrapper {
    z-index: 3;
    overflow: hidden;
    height: 1253px;
    /*为了让滚动的元素的第一个元素出现在nav下，要确定高度*/
  }

  .goods-wrapper {
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 15vw;
  }

  .goods-container {
    height: 100%;
    padding-bottom: 12.8vw;
    background-color: rgb(255, 255, 255);
  }

  .goods-item {
    display: flex;
    height: 100%;
  }

  .left-nav-wrapper {
    overflow-y: auto;
    /*height: 100%;*/
    background-color: rgb(245, 245, 245);
    padding-bottom: 10.666667vw;
    width: 20.533333vw;
    font-size: .32rem;
  ul{
    /*transition: none!important;*/
    transition: transfrom 10s linear!important;
  }
  li {
    position: relative;
    padding: 4.666667vw 2vw;
    color: rgb(102, 102, 102);

  img {
    width: 3.466667vw;
    height: 3.466667vw;
    vertical-align: top;
    margin-right: .8vw;
  }

  }
  .active {
    color: rgb(51, 51, 51);
    background-color: rgb(255, 255, 255);
  }

  }

  .right-menu-wrapper {
    position: relative;
    /*height: 100%;*/
    width: 79.466667vw;
    /*overflow-y: auto;*/


  ul {
    /*height: 100%;*/
    padding-bottom: 10.666667vw;
    /*transition: transform 0.3s linear!important;*/

  li {
    position: relative;
    margin: 0;
    min-height: 30.666667vw;
    padding-left: 2.666667vw;
  }

  }
  }
  .title-wrapper {
    position: relative;
    margin-left: 2.666667vw;
    padding: 2vw 8vw 2vw 0;
    display: flex;
    align-items: center;
    overflow: hidden;

  .title-name {
    margin-right: 1.333333vw;
    font-weight: 700;
    font-size: .32rem;
    color: rgb(102, 102, 102);
    flex: none;
  }

  .title-des {
    flex: 1;
    color: rgb(153, 153, 153);
    font-size: .266667rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  }

  .goods-info-container {
    padding: 2.666667vw 0;
    margin-bottom: .133333vw;
    display: flex;
    /*min-height: 25.466667vw;*/
    position: relative;
  }

  .goods-img-container {
    width: 25.333333vw;
    height: 25.333333vw;
    flex: none;
    margin-right: 2.666667vw;
    position: relative;

  img {
    width: 100%;
    border-radius: .533333vw;
  }

  }
  .goods-item-container {
    flex: 1;
    position: relative;
    /*padding-bottom: 3.666667vw;*/
    padding-right: 4vw;
  }

  .goods-name {
    position: relative;
    padding-right: 4vw;
    display: flex;
    align-items: start;

  span {
    font-weight: 700;
    overflow: hidden;
    font-size: .4rem;
    white-space: nowrap;
    width: 40vw;
    text-overflow: ellipsis;
  }

  }
  .goods-des {
    margin: 2.333333vw 0;
    font-size: .266667rem;
    color: rgb(153, 153, 153);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 42.666667vw;
  }

  .goods-sale-info {
    margin: 1.733333vw 0 !important;
    color: rgb(153, 153, 153);
    font-size: .266667rem;
    line-height: 1;
    min-height: 1em;

  span {
    vertical-align: middle;
  }

  span:nth-child(2) {
    margin-left: 1.066667vw;
  }

  }
  .goods-discount {
    display: flex;
    height: 4vw;

  .discount-tag {
    display: inline-block;
    height: 4vw;
    padding: 0 .8vw;
    border-radius: .266667vw;
    border: .133333vw solid rgba(235, 102, 82, 0.3);
    color: rgb(235, 101, 81);
    position: relative;
    transform: scale(0.8);
    transform-origin: 0 0;

  }

  span:nth-child(2) {
    display: inline-block;
    height: 4vw;
    padding: 0 .8vw;
    margin-left: -2vw;
    color: rgb(240, 115, 115);
    position: relative;
    transform: scale(0.8);
    transform-origin: 0 0;
  }

  }
  .goods-price {
    position: absolute;
    bottom: -1vw;
    font-size: .48rem;
    line-height: 4.266667vw;
    color: rgb(255, 83, 57);
    padding-bottom: .933333vw;
    display: flex;
    align-items: baseline;
  }

  .goods-price::before {
    content: "￥";
    font-size: 0.37rem;
    display: inline-block;
  }

  .old-price {
    font-size: 0.4rem;
    color: rgb(153, 153, 153);
    margin-left: 1.6vw;
    transform: scale(0.8);
    text-decoration: line-through;
  }

  .old-price::before {
    content: "￥";
    font-size: 0.35rem;
    display: inline-block;
    text-decoration: line-through;
  }

  .goods-icon-wrapper {
    position: absolute;
    right: 4vw;
    bottom: -0.5vw;

  .download-icon-wrapper {
    color: rgb(35, 149, 255);
    font-size: 0.7rem;
  }

  }
  .goods-icon-container {
    display: inline-flex;
    font-size: .346667rem;
    align-items: center;
  }

  .minus-icon {
    display: inline-block;
    vertical-align: middle;
    text-decoration: none;
  }

  .goods-counts {
    display: inline-block;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    vertical-align: middle;
    font-size: .373333rem;
    width: 6.933333vw;
    overflow: hidden;
  }

  .mini-tag {
    position: absolute;
    right: 1.8vw;
    top: 1.8vw;
    color: rgb(255, 255, 255);
    background-image: linear-gradient(-90deg, rgb(255, 116, 22), rgb(255, 60, 21) 98%);
    border-radius: 2vw;
    font-size: .266667rem;
    font-weight: 700;
    text-align: center;
    min-width: 1.733333vw;
    padding: 0 1.066667vw;
    line-height: 3.733333vw;
  }

</style>
