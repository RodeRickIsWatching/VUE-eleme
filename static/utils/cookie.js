let CookieManage = {
  set: function (name, value, days) {
    var d = new Date;
    d.setDate(d.getDate() + days);
    window.document.cookie = name + "=" + value + ";path=/;expires=" + d;
  },
  get: function (name) {
    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  },
  delete: function (name) {
    this.set(name, '', -1);
  }
};


module.exports = CookieManage;
