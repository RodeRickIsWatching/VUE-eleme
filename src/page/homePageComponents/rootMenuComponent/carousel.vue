<template>
  <div class="carousel-wrapper">
    <div class="slide-img-wrapper">
      <div
        @touchstart.prevent="touchstart($event)"
        @touchmove.prevent="touchmove($event)"
        @touchend.prevent="touchend($event)"
        ref="slideImg"
        :class="{'if-active':index==nowIndex}"
        class="slide-img" v-for="(item,index) in carouselArr">
        <a>
          <!--<img :src="item">-->
          <img v-lazy="{src: item}">
        </a>
      </div>
    </div>
    <div class="slide-bar-wrapper">
      <div :class="{'if-active':index==nowIndex}"
           class="slide-bar" v-for="(item,index) in carouselArr">
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"


  export default {
    name: "carousel",
    data() {
      return {
        carouselArr: [require('../../../assets/carousel0.webp'), require('../../../assets/carousel1.webp'), require('../../../assets/carousel2.webp'), require('../../../assets/carousel3.webp')],
        nowIndex: 0,
        dir: 0,
        moveMent: 0,
        touchedPlace: 0,
        animateKey: true,
        timer: null,
        touch: false,
      }
    },
    computed: {
      ...mapState(["carouselSrc"]),
      // loadingImgObj(){
      //   return {
      //     src: this.bgArr[0],
      //     loading: require("../../assets/bg-loading.jpg")
      //   }
      // }
    },
    methods: {
      checkClass() {
        let len = this.$refs.slideImg.length;
        //第二个思路 通过index来引导移动
        let imgArr = [];
        for (let i = 0; i < len; i++) {
          imgArr.push(this.$refs.slideImg[i])
        }
        return imgArr
      },
      touchstart(e) {
        this.touchedPlace = e.touches[0].clientX;
        this.moveMent = 0;
        this.dir = 0;
        clearInterval(this.timer);
      },
      touchmove(e, _move) {
        if (this.animateKey) {
          //思路：只在屏幕上显示nowIndex的图片，其他图片统统移动到-710px,
          //当向右滑，计算上一张的位置
          //当向左滑，计算下一张的位置
          this.moveMent = _move ? _move : (e.touches[0].clientX - this.touchedPlace);
          let _obj = this.checkClass();
          _obj[this.nowIndex].style["transform"] = `translate3d(${this.moveMent}px,0,0)`;
          if (Math.abs(this.moveMent) <= 710) {
            if (this.moveMent > 10) {
              //右移
              this.dir = -1;
              let prevIndex = (-1 + _obj.length + this.nowIndex) % _obj.length;
              //因为右移，因此计算上一张随move移动的距离
              _obj[prevIndex].style["transform"] = `translate3d(${-710 + this.moveMent}px,0,0)`;
            } else if (this.moveMent < -10) {
              //  左移
              this.dir = 1;
              let nextIndex = (1 + _obj.length + this.nowIndex) % _obj.length;
              _obj[nextIndex].style["transform"] = `translate3d(${710 + this.moveMent}px,0,0)`;
            } else {
              this.dir = 0;
              _obj[this.nowIndex].style["transform"] = `translate3d(0px,0,0)`;
            }
          }
        }
      },
      touchend(e) {
        let _obj = this.checkClass();
        if (this.dir == -1) {
          //向右滑动
          //添加动画
          let prevIndex = (-1 + _obj.length + this.nowIndex) % _obj.length;
          _obj[prevIndex].style["transition"] = `transform 400ms ease-in-out 0s`;
          //确定图片的最终位置
          _obj[prevIndex].style["transform"] = `translate3d(0px,0,0)`;
          //替换if-active
          _obj[prevIndex].classList.toggle("if-active");
          //指定下一个index
          _obj[this.nowIndex].style["transition"] = `transform 400ms ease-in-out 0s`;
          _obj[this.nowIndex].style["transform"] = `translate3d(${-710 * this.dir}px,0,0)`;
          _obj[this.nowIndex].classList.toggle("if-active");
          this.nowIndex = (-1 + _obj.length + this.nowIndex) % _obj.length;
        } else if (this.dir == 1) {
          let nextIndex = (1 + _obj.length + this.nowIndex) % _obj.length;
          if (_obj[nextIndex] && typeof(nextIndex) == 'number'&& !Object.is(typeof(nextIndex),NaN)) {
          //  若没有判断在切换路由时，自动播放会报错，虽然不影响但是控制台中会有显示
          //  原因是播放未完成就切换了路由,即在没有执行clearTimeInterval就切换路由
          //  导致原timer依旧存在,但无法读取到index信息,因此报错
          _obj[nextIndex].style["transition"] = `transform 400ms ease-in-out 0s`;
          _obj[nextIndex].style["transform"] = `translate3d(0px,0,0)`;
          _obj[nextIndex].classList.toggle("if-active");
          _obj[this.nowIndex].style["transition"] = `transform 400ms ease-in-out 0s`;
          _obj[this.nowIndex].style["transform"] = `translate3d(${-710 * this.dir}px,0,0)`;
          _obj[this.nowIndex].classList.toggle("if-active");
          this.nowIndex = (1 + _obj.length + this.nowIndex) % _obj.length;
          }
        } else if (this.dir == 0) {
          _obj[this.nowIndex].style["transform"] = `translate3d(0px,0,0)`;
        }
        //再启动定时器
        setTimeout(() => {
          for (let i in _obj) {
            _obj[i].style = null;
          }
          this.animateKey = true;
          this.autoPlay();
        }, 410);
      },
      //自动播放
      autoPlay() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.animateKey = false;
          this.dir = 1;
          this.touchmove(this.$event, -100);
          this.touchend();
          this.$once('hook:beforeDestroy', () => {
            clearInterval(this.timer);
          });
        }, 4000)

      }
    },
    created() {
      this.$nextTick(() => {
        this.autoPlay()
      });
    },
    destroyed(){
      clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="scss" type="text/css">
  .carousel-wrapper {
    position: relative;
    /*margin-top: 1.333333vw;*/
    border-radius: 1.066667vw;
    width: 100%;
    height: 23.466667vw;
    overflow: hidden;

  img {
    width: 100%;
    height: auto;
  }

  }
  .slide-img {
    position: absolute;
    width: 100%;
    transform: translate3d(710px, 0px, 0px);
  }

  .slide-img.if-active {
    transform: none;
  }

  .slide-bar-wrapper {
    position: absolute;
    bottom: 10px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .slide-bar {
    width: 2.4vw;
    height: .4vw;
    border-radius: 0;
    background: rgb(0, 0, 0);
    opacity: 0.5;
    margin: 0 3px;
    display: inline-block;
  }

  .slide-bar.if-active {
    background-color: rgb(0, 166, 255);
  }


</style>
