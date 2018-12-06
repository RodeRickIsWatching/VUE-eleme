<template>
  <div class="nav-com">
    <div class="nav-bar-wrapper" ref="navItemWrapper">
      <div class="bar-wrapper" v-if="homePageNav[0][0]">
        <div
          @touchstart="touchstart($event)"
          @touchmove="touchmove($event)"
          @touchend="touchend($event)"
          class="nav-item" v-for="(item,index) in homePageNav"
          :class="{'if-active':index==nowIndex}"
          ref="navItem">
          <a class="content" v-for="(item2,index2) in item">
            <div><img :src="getImg(index)"></div>
            <span>{{item2.title}}</span>
          </a>
        </div>
      </div>

      <div class="shell-placeholder" v-else>
        <div class="shell-wrapper" v-for="(item,index) in homePageNav">
          <div class="shell-content" v-for="(item2,index2) in item"  v-if="index2<=4">
          </div>
        </div>
      </div>


      <div class="nav-bar-index-wrapper" v-if="homePageNav[0][0].title">
        <div class="nav-bar-index" v-for="(item,index) in homePageNav"
             :class="{'if-active':index==nowIndex}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "navBar",
    data() {
      return {
        touchedPlace: 0,
        moveMent: 0,
        dir: 0,
        animateKey:true,
        nowIndex: 0
      }
    },
    computed: {
      ...mapState(["homePageNav"])
    },
    methods: {
      getImg(_key) {
        if(this.homePageNav[0][0].title){
          if (_key == 0) {
            return require('../../../assets/food.webp');
          } else {
            return require('../../../assets/burger.webp');
          }
        }
      },
      checkClass() {
        //别在computed中写这个方法，其结果不会刷新的
        let len = this.$refs.navItem.length;
        let obj = {};
        for (let i = 0; i < len; i++) {
          if (this.$refs.navItem[i].classList.contains('if-active')) {
            obj.active = this.$refs.navItem[i];
          } else {
            //以后页面复杂了可以替换成数组形式进行push
            obj.others = this.$refs.navItem[i];
          }
        }
        return obj
      },
      touchstart(e) {
        this.touchedPlace = e.touches[0].clientX;
        this.moveMent = 0;
        this.dir = 0;
      },
      touchmove(e) {
        this.moveMent = e.touches[0].clientX - this.touchedPlace;
        let _obj = this.checkClass();
        if (Math.abs(this.moveMent) <= 750) {
          if (this.moveMent > 1) {
            //  向右移动
            this.dir = -1;
            _obj.active.style["transform"] = `translate3d(${this.moveMent}px,0,0)`;
            _obj.others.style["transform"] = `translate3d(${this.moveMent - 750}px,0,0)`;
          } else if (this.moveMent < -1) {
            //  向左移动
            this.dir = 1;
            _obj.active.style["transform"] = `translate3d(${this.moveMent}px,0,0)`;
            _obj.others.style["transform"] = `translate3d(${750 + this.moveMent}px,0,0)`;
          } else {
            this.dir = 0;
            // 没有移动
            _obj.active.style["transform"] = `translate3d(0px,0,0)`;
            _obj.others.style["transform"] = `translate3d(750px,0,0)`;
          }
        }
      },
      touchend(e) {
        let _obj = this.checkClass();
        if(this.animateKey){
          this.animateKey = false;
          _obj.active.style["transition"] = `transform 300ms ease-in-out 0s`;
          _obj.others.style["transition"] = `transform 300ms ease-in-out 0s`;
          if (this.dir !== 0) {
            if (this.dir == 1) {
              //  向左移动，松手后原active最后移动到最左边
              _obj.active.style["transform"] = `translate3d(-750px,0,0)`;
            } else if (this.dir == -1) {
              //  向右，松手后原active最后移动到最右边
              _obj.active.style["transform"] = `translate3d(750px,0,0)`;
            }
            _obj.others.style["transform"] = `translate3d(0px,0,0)`;

            //交换class，保证视觉上看到的是if-active
            _obj.active.classList.toggle("if-active");
            _obj.others.classList.toggle("if-active");
            this.nowIndex = this.nowIndex==0 ? 1 : 0;
          }
        }

        setTimeout(() => {
          _obj.active.style = null;
          _obj.others.style = null;
          this.animateKey = true;
        }, 300);

      }
    },
    created(){
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .nav-com{
  }
  .nav-bar-wrapper {
    position: relative;
    overflow: hidden;
    /*overflow-x: scroll;*/
    display: inline-block;
    height: 47.2vw;
    background-color: rgb(255, 255, 255);
    text-align: center;
    width: 100%;

  .bar-wrapper {
    height: 100%;

  .nav-item {
    height: 100%;
    position: absolute;
    transform: translate3d(-100%, 0, 0);

  &.if-active {
    transform: none;
  }

  a {
    float: left;
    margin-top: 2.933333vw;
    width: 20%;
  img {
    width: 12vw;
    height: 12vw;

  }

  span {
    display: inline-block;
    margin-top: 1.333333vw;
    color: rgb(102, 102, 102);
    font-size: .32rem;
  }

  }
  }
  }
  }

  .nav-bar-index-wrapper{
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .nav-bar-index{
    width: 2.4vw;
    height: .4vw;
    margin: 0 .666667vw;
    background: rgb(0, 0, 0);
    display: inline-block;
    opacity: 0.5;
  }
  .nav-bar-index.if-active{
    background-color: rgb(22, 206, 255);
  }

  .shell-placeholder{
    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  .shell-wrapper{
    padding-top: 2.933333vw;
    display: flex;
  }

  .shell-content{
    flex: 1;
    flex-direction: column;
    display:flex;
    align-items: center;
  &::before{
     content: "";
     display: inline-block;
     width: 10.666667vw;
     height: 10.666667vw;
     margin-top: .8vw;
     margin-bottom: .533333vw;
     border-radius: 50%;
     background: rgb(244, 244, 244);
   }
  &::after{
     content: "";
     display: inline-block;
     width: 8vw;
     height: 3.733333vw;
     margin-top: 1.333333vw;
     background: rgb(244, 244, 244);
   }
  }
</style>
