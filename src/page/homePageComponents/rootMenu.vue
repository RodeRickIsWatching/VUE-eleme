<template>
  <div>
    <v-title class="title"></v-title>
  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex"
  import locationTitle from "./rootMenuComponent/locationTitle"

  export default {
    name: "rootMenu",
    components: {
      "v-title": locationTitle
    },
    computed: {
      ...mapState(["userInfo"]),
    },
    methods: {
      ...mapActions(["getLocation"])
    },
    created() {

    }
  }
</script>

<style scoped lang="scss" type="text/css">

</style>
