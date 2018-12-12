import Mock from "mockjs"
import userInfo from "./userInfo.json"
import homePageInfos from "./homePageInfos.json"
import storeLists from "./storeLists.json"
import locationLists from "./locationLists.json"
import cityLists from "./cityLists.json"
import storeInfo0 from "./storeInfo0.json"
import storeInfo1 from "./storeInfo1.json"
import storeInfo2 from "./storeInfo2.json"
import storeInfo3 from "./storeInfo3.json"
import storeInfo4 from "./storeInfo4.json"
import checkOut from "./checkoutInfo.json"


Mock.mock("/userInfo", "post", function options(options) {
  //一定要JSON.parse
  //未使用前数据是{"ID":"13761696060","passWord":"123456"}
  //使用后 {ID:"13761696060",passWord:"123456"}
  let temp = JSON.parse(options.body);
  if (temp.passWord && temp.ID) {
    if (temp.passWord == 123456) {
      return {
        data: userInfo.member
      }
    } else {
      return {
        data: userInfo.visitor
      }
    }
  }
});

Mock.mock("/homePageInfos", "get", {
  //包含轮播图、导航栏的图片信息等
  data: homePageInfos
});

Mock.mock("/storeLists", "get", {
  //所有的商铺信息
  data: storeLists
});

Mock.mock("/locationLists", "get", {
  //不同地区对应的地址
  data: locationLists
});

Mock.mock("/cityLists", "get", {
  //不同地区对应的地址
  data: cityLists
});

Mock.mock("/store0", "get", {
  //不同地区对应的地址
  data: storeInfo0
});
Mock.mock("/store1", "get", {
  //不同地区对应的地址
  data: storeInfo1
});
Mock.mock("/store2", "get", {
  //不同地区对应的地址
  data: storeInfo2
});
Mock.mock("/store3", "get", {
  //不同地区对应的地址
  data: storeInfo3
});
Mock.mock("/store4", "get", {
  //不同地区对应的地址
  data: storeInfo4
});


Mock.mock("/checkOutUp", "post", function (options) {
  //本来应该上传给服务器，但是前段无法使用fs，利用storage来模拟
  window.localStorage.setItem("checkOutInfo", options.body);
});
Mock.mock("/checkOut", "get", function () {
  let temp = JSON.parse(window.localStorage.getItem("checkOutInfo"));
  return {data: temp}
});

Mock.mock("/ordered", "get", function(){
  let temp = JSON.parse(window.localStorage.getItem("ordered"));
  return {data: temp}
});

