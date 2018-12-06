<template>
  <div class="loading-animate-wrapper"></div>
</template>

<script>
    export default {
        name: "loadingAnimation"
    }
</script>

<style scoped lang="scss" type="text/css">
  .loading-animate-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

  &::after {
     display: block;
     content: '';
     width: .64rem;
     height: .64rem;
     border-left: .853px solid rgba(0, 0, 0, 0);
     border-left: .053333rem solid rgba(0, 0, 0, 0);
     border-right: .853px solid rgba(0, 0, 0, 0);
     border-right: .053333rem solid rgba(0, 0, 0, 0);
     border-bottom: .853px solid rgba(0, 0, 0, 0);
     border-bottom: .053333rem solid rgba(0, 0, 0, 0);
     border-top: .853px solid rgb(35, 149, 255);
     border-top: .053333rem solid rgb(35, 149, 255);
     border-radius: 100%;
     z-index: 1;
     animation: loadings 0.5s infinite linear;
   }

  }
  @keyframes loadings {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
</style>
