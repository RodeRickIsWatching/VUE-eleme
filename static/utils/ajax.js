function sendAjax(method, _url, _params) {
  let _ajax = new XMLHttpRequest();
  let _method = method.toUpperCase();
  if (_method == "GET") {
    let url = `${_url}?${_params}`;
    _ajax.open("GET", url, true);
    _ajax.send();
  } else if (_method == "POST") {
    _ajax.open("POST", url, true);
    _ajax.setRequestHeader("application/x-www-form-urlencoded");
    _ajax.send(_params);
  } else {
    throw new Error("Wrong Method")
  }
  return _ajax;
}


module.exports.sendAjax = sendAjax;
