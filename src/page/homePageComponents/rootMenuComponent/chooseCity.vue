<template>
  <div class="wrapper">
    <div class="header">
      <div class="backIcon download-icon-wrapper" @click="changeCityFlag(false)">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['left-icon']"></use>
        </svg>
      </div>
      <h1 class="header-info">城市选择</h1>
    </div>
    <div class="city-input-wrapper">
      <input type="text" placeholder="请输入城市">
    </div>


    <!--城市目录-->
    <div class="city-alphabet-wrapper"  v-if="cityLists" ref="alphabet">
      <div class="city-alphabet"
           v-for="(item3,index3) in cityLists.alphabet">
        <span @click="chooseCityName(index3)">{{item3}}</span>
      </div>
    </div>
    <!--城市名-->
    <div class="city-lists-wrapper" ref="cityLists">
      <div class="lists" v-if="cityLists">
        <div class="item"
             v-for="(item,index) in cityLists.cityList">
          <div class="item-title">
            <span>{{item.idx.toUpperCase()}}</span>
            <div class="onepx-border-bottom"></div>
          </div>
          <div class="item-city"
               @click="chooseCity(item2.name)"
               v-for="(item2,index2) in item.cities"
               :class="{'city-border-bottom':index2!=item.length-1}">
            <span>{{item2.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from "vuex"
  import BS from "better-scroll"
  export default {
    name: "chooseCity",
    computed: {
      ...mapState(["iconObj", "orderedLocation", "locationLists", "chooseCityFlag","cityLists"])
    },
    data(){
      return {
        cityListScroll: null
      }
    },
    methods: {
      ...mapMutations(["changeCityFlag"]),
      ...mapActions(["getLocationLists"]),
      chooseCity(_city){
        this.changeCityFlag(false);
        this.getLocationLists(_city);
        console.log(`获取${_city}地名列表`);
      },
      chooseCityName(_index){
        let cityLists = this.$refs.cityLists.getElementsByClassName("item-title");
        this.cityListScroll.refresh();
        this.cityListScroll.scrollToElement(cityLists[_index],200);
      },
      BSInit(){
        this.cityListScroll = new BS(this.$refs.cityLists,{
          click: true,
          probeType: 3,
          scrollY: true,
          bounce:{
            top: false,
            bottom: false,
            left: false,
            right: false
          }
        });
        // this.cityListScroll.on("scrollEnd",()=>{
        //   console.log(this.cityListScroll )
        // })
      },
      handleDefferInfo(){
        let timer = null;
        let a = new Promise((resolve, reject) => {
          if(this.cityLists != null){
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
            if(this.cityListScroll){
              this.cityListScroll.refresh();
            }else{
              this.BSInit();
            }
          })
        });
        a.catch(reject=>{
          timer = setTimeout(()=>{
            console.log("1s后尝试再次获取");
            this.$nextTick(()=>{
              this.handleDefferInfo();
            })
          },1000)
        })
      }
    },
    created(){
      //关闭选择城市的组件
      this.changeCityFlag(false);
      //初始化scroll
      this.$nextTick(()=>{
        this.handleDefferInfo();
      })
    },
  }
</script>

<style scoped lang="scss" type="text/css">

  .wrapper {
    background-color: #fff;
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
    margin-bottom: -10vw;
  }

  .header-info {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    display: inline-block;
    font-size: 0.48rem;
  }

  .city-input-wrapper{
    height: 11.733333vw;
    background-image: linear-gradient(90deg,rgb(0, 170, 255),rgb(0, 133, 255));
    text-align: center;
    position: sticky;
    top:1.1rem;
    input{
      border: none;
      width: 78vw;
      height: 7.5vw;
      margin-top: 1.866667vw;
      border-radius: 4vw;
      padding-left: 8vw;
      font-size: 0.32rem;
    }
  }

  .city-lists-wrapper{
    margin-top: 9.5vw;
    overflow: hidden;
    overflow-y: scroll;
    height: 80%;
    /*height: 100vh;*/
    font-size: .373333rem;
    color: rgb(51, 51, 51);
    margin-bottom: 12.333333vw;;
  }
  .item-title{
    position: relative;
    color: rgb(102, 102, 102);
    background: rgb(245, 245, 245);
    padding: 3.733333vw 0 1.866667vw 4vw;
  }
  .item-city{
    position: relative;
    height: 13.333333vw;
    margin-left: 4vw;
    line-height: 13.333333vw;
    span{
      display: inline-block;
      width: 80%;
      height: 100%;
    }
  }

  .city-border-bottom{
    border-bottom: 1px solid rgb(221, 221, 221);
  }

  .city-alphabet-wrapper{
    position: absolute;
    right: 2.666667vw;
    top: 40vw;
    width: 5.333333vw;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: rgb(153, 153, 153);
    z-index: 20;
    span{
      display: inline-block;
      width: 100%;
      height: 5.333333vw;
      line-height: 5.333333vw;
    }
  }


</style>
