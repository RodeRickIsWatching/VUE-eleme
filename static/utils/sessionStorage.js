let sessionStorageManage = {
  set: function (name, value) {
    if(typeof(value) !== "string" ){
      value = JSON.stringify(value);
      window.sessionStorage.setItem(name, value)
    }else{
      window.sessionStorage.setItem(name, value)
    }
  },
  get: function (name) {
    let value = window.sessionStorage.getItem(name);
    return JSON.parse(value);
  },
  delete: function (name) {
    window.sessionStorage.removeItem(name);
  },
  clear: function(){
    window.sessionStorage.clear();
  }
};

module.exports = sessionStorageManage;
