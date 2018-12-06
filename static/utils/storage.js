let storageManage = {
  set: function (name, value) {
    if(typeof(value) !== "string" ){
      value = JSON.stringify(value);
      window.localStorage.setItem(name, value)
    }else{
      window.localStorage.setItem(name, value)
    }
  },
  get: function (name) {
    let value = window.localStorage.getItem(name);
    console.log(JSON.parse(value));
    return JSON.parse(value);
  },
  delete: function (name) {
    window.localStorage.removeItem(name);
  },
  clear: function(){
    window.localStorage.clear();
  }
};


module.exports = storageManage;
