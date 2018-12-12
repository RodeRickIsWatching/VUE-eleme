<template>
  <div class="wrapper">
    <div class="header">
      <div class="backIcon download-icon-wrapper" @click="changeLocationFlag(false)">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
      <h1 class="header-info">选择收货地址</h1>
    </div>

    <div class="select-choice-wrapper">
      <div class="city-choose-button" @click="chooseCity()">
        <span v-if="choosedCity">{{choosedCity}}</span>
        <span v-else>选择城市</span>
        <div class="download-icon-wrapper">
          <svg class="download-icon" aria-hidden="true">
            <use :xlink:href="iconObj['down-icon']"></use>
          </svg>
        </div>
      </div>
      <div class="location-input-wrapper">
        <input type="text" placeholder="请输入地址" @input="input($event.target.value)" ref="input">
      </div>
    </div>
    <section v-if="locationInput&&!isMatched" class="no-location-list-wrapper">
      <img src="../../../assets/no-matched.gif">
      <h3>没有搜索结果</h3>
      <h5>换个关键字试试</h5>
    </section>
    <section v-show="choosedCity" class="location-list-wrapper">
      <div class="location-wrapper" v-for="(item, key) in locationArr" :key="key"
      @click="chooseLocation(key)">
        <div class="location-item">
          <div class="location-name">{{item.name}}</div>
          <div class="location-road">{{item.road}}</div>
        </div>
        <div class="location-distance-info">{{item.distance}}m</div>
        <div class="onepx-border-bottom"></div>
      </div>
    </section>


    <v-chooseCity v-show="chooseCityFlag" class="new-page"></v-chooseCity>





  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from "vuex"
  import chooseCity from "./chooseCity"

  export default {
    name: "selectLocation",
    data() {
      return {
        pageSlideOutFlag: false,
        locationInput: false,
        locationArr: [],
        isMatched: false,
        indexMap:{}
      }
    },
    computed: {
      ...mapState(["choosedCity","iconObj", "userInfo", "locationLists","chooseCityFlag"])
    },
    methods: {
      ...mapMutations(["changeLocationFlag","changeCityFlag"]),
      ...mapActions(["getCityLists", "getLocationLists","updateNowLocation"]),
      chooseLocation(_key){
        let _index = this.indexMap[_key];
        let _location = this.locationLists[_index].name;
        this.updateNowLocation(_location);
        this.changeLocationFlag(false);
        },
      input(_val) {
        this.locationArr = [];
        this.indexMap = {};
        if (_val != '' && _val != undefined && _val != null) {
          this.locationInput = true;
          let reg = new RegExp(_val);
          for (let i = 0;i < this.locationLists.length; i++) {
            let flag = reg.test(this.locationLists[i]["name"]);
            if (flag) {
              //这里可以加筛选的条件
              if(this.locationLists[i]["distance"]<500){
                //push前需要将索引对应起来方便后续点击选择地址
                this.indexMap[this.locationArr.length] = i;
                this.locationArr.push(this.locationLists[i]);
                console.log(this.indexMap)
              }
            }
          }
        }else{
          this.locationInput = false;
        }
        if(this.locationArr.length>0){
          this.isMatched = true;
        }else{
          this.isMatched = false;
        }
      },
      chooseCity() {
        this.$refs.input.value = '';
        this.locationInput = false;
        this.changeCityFlag(true);
      }
    },
    created() {
      //选择城市后，然后发送请求获取该城市的地址，通过查找的方式匹配地址
      this.getCityLists();
      if(this.userInfo){
        console.log(`获取${this.choosedCity}地名列表`);
        this.getLocationLists(this.userInfo.city);
      }
    },
    components:{
      "v-chooseCity":chooseCity
    }
  }
</script>

<style scoped lang="scss" type="text/css">

  .wrapper {
    background: rgb(242, 242, 242);
    overflow: hidden;
    overflow-y: auto;
  }

  .header {
    width: 100%;
    color: #fff;
    height: 1.173333rem;
    line-height: 1.173333rem;
    position: sticky;
    top: 0px;
    background-image: linear-gradient(90deg, rgb(0, 170, 255), rgb(0, 133, 255));
  }

  .header-info {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    display: inline-block;
    font-size: 0.48rem;
  }

  .select-choice-wrapper {
    display: flex;
    background-color: rgb(255, 255, 255);
    width: 100%;
  }

  .city-choose-button {
    display: flex;
    align-items: center;
    padding-left: 4vw;
  span {
    display: inline-block;
    font-size: .32rem;
    background: rgb(255, 255, 255);
    width: 10.666667vw;
    color: rgb(51, 51, 51);
    margin-right: 1.333333vw;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }

  .download-icon-wrapper {
    /*display: inline-block;*/
    /*position: relative;*/
    /*top: -8px;*/
    display: flex;
    align-items: center;
    /*width: 1.6vw;*/
    /*height: 1.6vw;*/
    /*font-size: 0.5rem;*/
  }

  }
  .location-input-wrapper {
    padding: 2.666667vw 13.5vw 2.666667vw 4vw;
    flex: 1;
    width: 100%;

  input {
    font-size: .346667rem;
    line-height: 4.8vw;
    width: 100%;
    height: 4.8vw;
    color: rgb(153, 153, 153);
    border-radius: .266667vw;
    padding: 2.4vw 4.8vw;
    background: rgb(242, 242, 242);
    border: none;
  }

  }
  .no-location-list-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 40vw;

  h3 {
    margin: 3.333333vw 0 3.666667vw;
    color: rgb(106, 106, 106);
    font-weight: 400;
    font-size: .453333rem;
  }

  h5 {
    margin: 0 0 3.333333vw;
    color: rgb(153, 153, 153);
    font-size: .306667rem;
  }

  }

  .location-wrapper{
    font-size: .32rem;
    background-color: rgb(255, 255, 255);
    padding: 2.933333vw 4vw;
    color: rgb(42, 42, 42);
    display: flex;
    position: relative;
  }
  .location-item{
    flex: 1;
  }
  .location-name{
    font-weight: 700;
    font-size: .4rem;
    color: rgb(51, 51, 51);
  }
  .location-road{
    color: rgb(51, 51, 51);
    font-size: .32rem;
    line-height: 4.533333vw;
    margin-top: .533333vw;
  }
  .location-distance-info{
    width: 13.333333vw;
    text-align: center;
  }
  .new-page {
    height: 100%;
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    /*left: 0;*/
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow: auto;
  }
</style>
