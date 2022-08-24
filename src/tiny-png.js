const https = require('https');
const fs = require('fs');

const options = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
  },
};

// 生成随机IP， 赋值给 X-Forwarded-For
function getRandomIP() {
  return Array.from(Array(4))
    .map(() => parseInt(Math.random() * 255))
    .join('.');
}

// 异步API,压缩图片
// {"error":"Bad request","message":"Request is invalid"}
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
function fileUpload(img) {
  options.headers['X-Forwarded-For'] = getRandomIP();
  var req = https.request(options, function (res) {
    res.on('data', (buf) => {
      let obj = JSON.parse(buf.toString());
      if (obj.error) {
        console.log(`[${img}]：压缩失败！报错：${obj.message}`);
      } else {
        fileUpdate(img, obj);
      }
    });
  });

  req.write(fs.readFileSync(img), 'binary');
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

// 该方法被循环调用,请求图片数据
function fileUpdate(imgpath, obj) {
  let options = new URL(obj.output.url);
  let req = https.request(options, (res) => {
    let body = '';
    res.setEncoding('binary');
    res.on('data', function (data) {
      body += data;
    });

    res.on('end', function () {
      fs.writeFile(imgpath, body, 'binary', (err) => {
        if (err) return console.error(err);
        console.log(
          `[${imgpath}] \n 压缩成功，原始大小-${obj.input.size}，压缩大小-${obj.output.size}，优化比例-${obj.output.ratio}`
        );
      });
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

module.exports = { fileUpload };
