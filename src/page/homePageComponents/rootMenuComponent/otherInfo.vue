<template>
  <div>
    <div class="other-info">
      <div class="other-links-wrapper">
        <div class="other-links" v-for="(item, index) in otherInfo">
          <div class="title" :class="{redColor:item.type==1}">{{item.title}}</div>
          <div class="des">{{item.des}}
          </div>
          <div class="other" :class="{redColor:item.type==1}">{{item.other}} ></div>
          <img :src="imgArr[0]">
        </div>
      </div>
    </div>
    <v-carousel></v-carousel>
  </div>
</template>

<script>
  import carousel from "../rootMenuComponent/carousel"
  import {mapState} from "vuex"

  export default {
    name: "other-info",
    data() {
      return {
        imgArr: [require('../../../assets/other-food.webp')]
      }
    },
    computed: {
      ...mapState(["otherInfo"])
    },
    components: {
      "v-carousel": carousel,
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .other-info {
    background: rgb(255, 255, 255);
  }

  .other-links-wrapper {
    margin-bottom: .8vw;
    display: flex;
  }

  .other-links {
    position: relative;
    height: 33.5vw;
    margin-bottom: .8vw;
    padding: 3.2vw 0 0 4vw;
    margin-right: .8vw;
    flex: 1;
    background: linear-gradient(0deg, rgb(244, 244, 244) 5%, rgb(250, 250, 250) 95%);

  img {
    position: absolute;
    right: 0;
    bottom: -1.777vw;
    width: 32vw;
    height: 21.333333vw;
  }

  }
  .title {
    font-size: .453333rem;
    font-weight: 700;
    margin-bottom: 2.333333vw;
    color: rgb(51, 51, 51);
  }

  .des {
    font-size: .346667rem;
    color: rgb(119, 119, 119);
    margin-bottom: 2.8vw;
  }

  .other {
    font-size: .32rem;
    color: rgb(175, 130, 96);
    font-weight: 700;
  }

  .redColor {
    color: red;
  }




</style>
