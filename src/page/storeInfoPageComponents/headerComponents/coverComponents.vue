<template>
  <div class="wrapper" @click="ifCover(false)">
    <div class="activity-lists-wrapper">
      <h2>优惠活动</h2>
      <div class="activity-lists-container" v-if="storeInfo">
        <div class="activity-item"  v-for="(item,index) in tagObj">
          <span class="activity-tag"
                :class="'tag'+item.type">{{item.tagName}}</span>
          <span class="activity-info">{{item.des}}</span>
        </div>
      </div>
      <div class="download-icon-wrapper close-icon" v-if="storeInfo" @click="ifCover(false)">
        <svg class="download-icon" aria-hidden="true">
          <use :xlink:href="iconObj['down-icon']"></use>
        </svg>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState,mapMutations} from "vuex"

  export default {
    name: "coverComponents",
    computed: {
      ...mapState(["iconObj"]),
      ...mapState('storeInfos', ["storeInfo", "ifCovered"]),
    },
    data(){
      return {
        tagObj:[]
      }
    },
    methods:{
      ...mapMutations('storeInfos',["ifCover"]),
      tagInit(){
        if(this.storeInfo){
          let obj = {"0": "首单", "1": "满减", "2": "赠送", "3": "特价", "4": "折扣", "5": "保障", "6": "发票"};
          let tagObj = this.storeInfo.seller.supports;
          for(let i = 0; i < tagObj.length; i++){
            let temp = {"type":tagObj[i].type,"tagName":obj[tagObj[i].type],"des":tagObj[i].description};
            this.tagObj.push(temp);
          }
        }
        console.log(this.tagObj)
      }
    },
    mounted(){
      this.tagInit();
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  @import "../../../style/utils.scss";

  .wrapper {
    position: fixed;
  }

  .activity-lists-wrapper {
    position: absolute;
    background-color: rgb(245, 245, 245);
    box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, .4);
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    padding: 5.333333vw 6.933333vw;
    transform: translateY(-35%);
    box-sizing: border-box;
    animation: slideIn 0.2s ease;
    h2{
      text-align: center;
      font-size: .453333rem;
      font-weight: 600;
      margin-bottom: 4.133333vw;
    }
  }
  @keyframes slideIn {
    0%{
      transform: translateY(100%);
    }
    100%{
      transform: translateY(-35%);
    }
  }



  .close-icon{
    position: absolute;
    height: 6.4vw;
    width: 6.4vw;
    right: 2.666667vw;
    top: 2.666667vw;
    font-size: 0.7rem;
  }

  .activity-lists-container{
    height: 50.8vw;
    overflow-y: scroll;
  }

  .activity-item{
    margin-bottom: 3.066667vw;
    display: flex;
    font-size: .346667rem;
    align-items: center;
  }

  .activity-tag{
    height: 4.266667vw;
    padding: .6vw .8vw;
    margin-right: 1.6vw;
    font-size: .32rem;
    display: inline-block;
    box-sizing: border-box;
    border-radius: .266667vw;
    color: #fff;
  }


</style>
