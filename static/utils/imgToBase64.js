function imgToBase64(_url) {
  let img = new Image;
  img.src = _url;
  img.onload = function () {
    let base64 = getBase64Image(img);
    return base64;
  };
  img.onerror = function (e) {
    console.log(e)
  };
}
function getBase64Image(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  let dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}


module.exports = imgToBase64;


