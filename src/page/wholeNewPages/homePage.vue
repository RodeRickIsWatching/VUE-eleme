<template>
  <v-bottom-nav id="wrapper"></v-bottom-nav>
</template>

<script>
  import HomePageBottomNav from "../homePageComponents/HomePageBottomNav"

  export default {
    name: "homePage",
    components: {
      "v-bottom-nav": HomePageBottomNav
    }
  }
</script>

<style scoped>

</style>
