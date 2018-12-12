<template>
  <div>
    <div class="download-icon-wrapper minus-icon" ref="icon"
         @click="foodControl(item._menuIndex,item._foodIndex,-1)"
         v-if="shoppingList[`${item._menuIndex}${item._foodIndex}`]&&shoppingList[`${item._menuIndex}${item._foodIndex}`].foodCount>0">
      <svg class="download-icon" aria-hidden="true">
        <use :xlink:href="iconObj['minus-icon']"></use>
      </svg>
    </div>
    <span class="goods-counts"
          v-if="shoppingList[`${item._menuIndex}${item._foodIndex}`]&&shoppingList[`${item._menuIndex}${item._foodIndex}`].foodCount>0">
          {{shoppingList[`${item._menuIndex}${item._foodIndex}`].foodCount}}
    </span>
    <div class="download-icon-wrapper add-icon" ref="icon" @click="foodControl(item._menuIndex,item._foodIndex,1)">
      <svg class="download-icon" aria-hidden="true">
        <use :xlink:href="iconObj['add-icon']"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex"
  import axios from "axios"

  export default {
    name: "addMinusIcon",
    props: ["item"],
    computed: {
      ...mapState("storeInfos", ["storeInfo", "shoppingList", "menuInfo"]),
      ...mapState(["iconObj"])
    },
    methods: {
      ...mapActions("storeInfos", ["getStorageInfo", "updateShoppingList"]),
      foodControl(_item, _index, _state) {
        let tempObj = {_menuIndex: _item, _foodIndex: _index, _count: _state};
        // console.log(tempObj);

        this.updateShoppingList(tempObj)
      },
    },
    created() {
      // console.log(this.item)
    },
    beforeDestroy(){
    },
    // updated(){
    //   let temp = {
    //     shoppingList: this.shoppingList,
    //     menuInfo: this.menuInfo
    //   };
    //   axios.post("/shoppingInfos", temp)
    // },
  }
</script>

<style scoped>
  span {
    display: inline-block;
    vertical-align: middle;
    width: 4vw;
    text-align: center;
  }

  .download-icon-wrapper {
    color: rgb(35, 150, 255);
    font-size: 0.7rem;
    vertical-align: middle;
  }

  .download-icon-wrapper {
    display: inline-block;
    font-size: 0.7rem;
  }
</style>
