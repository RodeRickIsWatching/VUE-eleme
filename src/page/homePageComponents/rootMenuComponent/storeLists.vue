<template>
  <div id="wrapper">
    <div>
      <div class="store-list-title">
        推荐商家
      </div>
      <div class="filter-list-wrapper">
        <div class="nav-wrapper">
          <div class="filter-list">
            <a class="filter-list-item">
              <span>综合排序</span>
              <div class="download-icon-wrapper">
                <svg class="download-icon" aria-hidden="true">
                  <use :xlink:href="iconObj['down-icon']"></use>
                </svg>
              </div>
            </a>
            <a class="filter-list-item">
              <span>距离最近</span>
            </a>
            <a class="filter-list-item">
              <span>品质联盟</span>
            </a>
            <a class="filter-list-item">
              <span>筛选</span>
            </a>
          </div>
        </div>
      </div>



      <!--商家信息-->
      <div class="store-list-wrapper"  v-if="storeList">
        <ul>
          <li v-for="(item,index) in storeList">
            <div class="basic-info">
              <div class="logo-wrapper">
                <!--<img :src="logoArr[index]">-->
                <img v-lazy="logoArr[index]">
              </div>
              <!--<div class="main-info-wrapper overflow-ellipsis" @click="toStoreInfoPage(index,item)">-->
                <router-link :to="{path:`/store/store${index}/store${index}`}"
                             class="main-info-wrapper overflow-ellipsis"
                             tag="div">
                  <div class="store-name-wrapper">
                  <div class="store-name">
                    <span>{{item.name}}</span>
                    <div class="support-icon">
                      <span>
                        <div class="download-icon-wrapper">
                          <svg class="download-icon" aria-hidden="true">
                            <use :xlink:href="iconObj['mobile-icon']"></use>
                          </svg>
                        </div>
                        ···</span>
                    </div>
                  </div>
                </div>
                <div class="score-info-wrapper">
                  <div class="star-wrapper">
                    <div class="empty-star">
                      <img src="../../../assets/empty-star.svg">
                    </div>
                    <div class="filled-star" :style="{'width':storeObj[index].score}">
                      <img src="../../../assets/filled-star.svg">
                    </div>
                  </div>
                  <span class="score-info">{{item.score}}</span>
                  <span class="monthly-sale-info">月售{{item.monthlySale}}单</span>
                  <div class="delivery-info" v-if="item.deliveryWay">
                    {{item.deliveryWay}}
                  </div>
                </div>
                <div class="price-info-wrapper">
                  <div class="price-info">
                    <span>￥{{item.deliveryPrice}}起送 | 远距离配送费￥{{item.longDistanceDeliveryPrice}}</span>
                  </div>
                  <div class="distance-info">
                    <span>{{item.distance}}km | {{item.deliveryTime}}分钟</span>
                  </div>
                </div>
                </router-link>
              <!--</div>-->
            </div>


            <div class="additional-info">
              <div class="tag-info-wrapper">
                <div class="tag-info" v-for="(item2,index2) in item.tag">
                  <div class="tag-item" :class="{type0:item2.type === 0,type1:item2.type===1,type2:item2.type===2}">
                    <img src="../../../assets/bowl.webp" v-if="item2.type===2">
                    {{item2.name}}
                  </div>
                </div>
              </div>
              <div class="onepx-border-bottom"></div>
              <div class="activity-info-wrapper">
                <div class="activity-info-item">
                  <div class="activity-info" v-for="(item3,index3) in item.activity"
                       v-show="index3<storeArr[index].hideNum">
                    <div class="activity-tag-wrapper">
                    <span class="activity-tag"
                          :class="storeObj[index].tagClass[index3]">{{storeObj[index].tag[index3]}}</span>
                    </div>
                    <div class="activity-des-wrapper">
                      <span class="activity-des">{{item3.des}}</span>
                    </div>
                  </div>
                </div>
                <div class="activity-count-wrapper" @click="click(index)">
                  <div class="activity-count"><span>{{storeArr[index].activityNum}}个活动</span></div>
                  <div class="download-icon-wrapper" ref="icon">
                    <svg class="download-icon" aria-hidden="true">
                      <use :xlink:href="iconObj['down-icon']"></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--<keep-alive>-->
      <router-view></router-view>
    <!--</keep-alive>-->

  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex"
  import imgToBase64 from "../../../../static/utils/imgToBase64"

  export default {
    name: "store-lists",
    data() {
      return {
        storeArr: [],
        storeObj: {},
        logoArr:[],
      }
    },
    computed: {
      ...mapState(["iconObj", "storeList","orderedLocation"]),
      ...mapState("storeInfos",["storeInfo"])
    },
    methods: {
      ...mapActions(["updateNowLocation"]),
      ...mapActions(["storeInfos/getStoreInfo"]),
      storeListInit() {
        let len = Object.keys(this.storeList).length;
        let obj = {"0": "首", "1": "减", "2": "赠", "3": "特", "4": "折", "5": "保", "6": "票"};
        for (let i = 0; i < len; i++) {
          let tempObj = {"ifHide": true, "hideNum": 2, "activityNum": Object.keys(this.storeList[i].activity).length};
          this.storeArr.push(tempObj);

          let temp = this.storeList[i].activity;
          this.storeObj[i] = {"tag": [], "tagClass": [], "score": ""};
          this.storeObj[i].score = `${this.storeList[i]["score"] * 20}%`;
          for (let j in temp) {
            let tempTag = obj[temp[j].type];
            let tempTagClass = `tag` + temp[j].type;
            this.storeObj[i].tag.push(tempTag);
            this.storeObj[i].tagClass.push(tempTagClass);
          }
        }
      },
      click(_index) {
        let len = Object.keys(this.storeList[0].activity).length + 1;
        this.storeArr[_index]["ifHide"] = !this.storeArr[_index]["ifHide"];
        this.storeArr[_index]["hideNum"] = this.storeArr[_index]["hideNum"] == 2 ? len : 2;
        if(this.storeArr[_index]["hideNum"] != 2){
          this.$refs.icon[_index].style.transform = `rotateZ(180deg)`;
        }else{
          this.$refs.icon[_index].style.transform = `rotateZ(0deg)`;
        }
      },
      getLogoImg(){
        for(let i = 0; i < this.storeList.length; i++){
          let temp = require(`../../../`+this.storeList[i].avatar);
          this.logoArr.push(temp);
        }
      }
    },
    created() {
      this.storeListInit();
      this.getLogoImg();
      console.log(this.storeList)
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  #wrapper {
    margin-bottom: 12.333333vw;;
  }

  .store-list-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 9.6vw;
    font-size: .4rem;
    color: rgb(0, 0, 0);

  &:before {
    display: block;
    content: "";
    width: 5.333333vw;
    margin-right: 3.466667vw;
    height: .266667vw;
    background-color: rgb(153, 153, 153);
  }

  &:after {
    display: block;
    content: "";
    width: 5.333333vw;
    margin-left: 3.466667vw;
    height: .266667vw;
    background-color: rgb(153, 153, 153);
  }

  }

  .filter-list-wrapper {
    position: sticky;
    top: 13.5vw;
    z-index: 100;
  }

  .nav-wrapper {
    position: relative;
    border-bottom: 1px solid rgb(221, 221, 221);
    line-height: 10.4vw;
    z-index: 101;
    height: 10.666667vw;
  }

  .filter-list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 10.533333vw;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    z-index: 4;
    background-color: rgb(255, 255, 255);

  a {
    flex: 1;
    text-align: center;
    color: rgb(102, 102, 102);
    position: relative;
    font-size: .373333rem;
    z-index: 101;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  }
  .download-icon-wrapper {
    display: inline-block;
  }

  .store-list-wrapper {
    background: rgb(255, 255, 255);
  }

  .store-list-wrapper {

  li {
    position: relative;
    border-bottom: .133333vw solid rgb(238, 238, 238);
    background-color: rgb(255, 255, 255);
    color: rgb(102, 102, 102);
    padding: 4vw 0;
    list-style: none;
    font-size: .293333rem;
    line-height: normal;

  .basic-info {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0 2.666667vw;

  .logo-wrapper {
    position: relative;
    width: 17.333333vw;
    height: 17.333333vw;

  img {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: .533333vw;
    border: .133333vw solid rgba(0,0,0,.08);
  }

  }
  .main-info-wrapper {
    display: flex;
    flex: 1;
    padding-left: 2.666667vw;
    justify-content: space-between;
    overflow: hidden;
    flex-direction: column;

  .store-name-wrapper {
    /*align-items: center;*/
    display: block;
    width: 100%;

  .store-name {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    color: rgb(51, 51, 51);
    font-weight: 700;
    font-size: .4rem;
    span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  }
  .score-info-wrapper {

  .star-wrapper {
    margin-right: 1.066667vw;
    position: relative;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;

  .empty-star {

  img {
    width: 14.933333vw;
    height: 2.666667vw;
    /*flex: none;*/
    /*max-width: none;*/
  }

  }
  .filled-star {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;

  /*width: 100%;*/
  /*通过宽度控制分数*/
  img {
    width: 14.933333vw;
    height: 2.666667vw;
    /*flex: none;*/
    /*max-width: none;*/
  }

  }
  }
  }
  .score-info {
    margin-right: 1.566667vw;
  }

  }
  }
  }
  }
  .delivery-info {
    position: absolute;
    right: 20px;
    display: inline-block;
    margin-left: 1.066667vw;
    padding: 0 0.4vw;
    color: #fff;
    white-space: nowrap;
    font-size: .266667rem;
    border: .133333vw solid rgba(0, 0, 0, 0);
    border-radius: .4vw;
    line-height: 1.2;
    background-color: rgb(0, 170, 255);
  }

  .price-info-wrapper {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }

  .distance-info {
    color: rgb(153, 153, 153);
  }

  .additional-info {
    padding: 0 2.666667vw 0 22.666667vw;
  }

  .tag-info-wrapper {
    display: flex;
    margin: 2.666667vw 2.666667vw 0 0;
  }

  .tag-info {
    margin-right: 1.333333vw;
    margin-bottom: 1.066667vw;
    font-size: .266667rem;
    padding: 0 1.066667vw;
    border: .266667vw solid rgb(221, 221, 221);
    border-radius: .533333vw;

  img {
    margin-top: -.4vw;
    height: 2.666667vw;
    width: 2.666667vw;
    vertical-align: middle;
  }

  }

  .activity-info-wrapper {
    display: flex;
  }

  .activity-info-item {
    padding-right: 2.666667vw;
    overflow: hidden;
    flex: 1;
  }

  .activity-info {
    line-height: 4.8vw;
  }

  .activity-tag-wrapper {
    display: inline-block;
    margin-right: 1.6vw;
  }

  .activity-des-wrapper {
    display: inline-block;
  }

  .activity-tag {
    height: 3.733333vw;
    width: 3.733333vw;
    vertical-align: middle;
    color: #fff;
    padding: 0.25vw 0.4vw;
    font-size: 0.28rem;
  }

  .activity-des {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .activity-count-wrapper {
    text-align: right;
    padding: .8vw 2.666667vw 0 0;
    color: rgb(153, 153, 153);
    font-size: .266667rem;
    line-height: 1;
  }

  .activity-count {
    display: inline-block;
  }

  .download-icon-wrapper {
    display: inline-block;
    font-size: 0.35rem;
    font-weight: 700;
    transition: transform 0.3s linear;
  }

  .support-icon{
    align-items: center;
    margin-left: 2.666667vw;
  }
</style>
