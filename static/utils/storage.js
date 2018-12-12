let storageManage = {
  set: function (name, value, expired) {
    //expired这里用天为单位
    let tempExpired = new Date().getTime() + expired * 1000 * 3600 * 24;
    let tempVal = {
      value: value,
      expired: tempExpired
    };
    // if (typeof(value) !== "string") {
    tempVal = JSON.stringify(tempVal);
    window.localStorage.setItem(name, tempVal)
    // } else {
    //   window.localStorage.setItem(name, value)
    // }
  },
  get: function (name) {
    // let value = window.localStorage.getItem(name);
    // console.log(JSON.parse(value));
    let tempVal = JSON.parse(window.localStorage.getItem(name));
    // console.log(tempVal)
    if(new Date().getTime() > tempVal.expired){
      this.delete(name);
    }else{
      return JSON.parse(tempVal.value);
    }
  },
  delete: function (name) {
    window.localStorage.removeItem(name);
  },
  clear: function () {
    window.localStorage.clear();
  }
};


module.exports = storageManage;
