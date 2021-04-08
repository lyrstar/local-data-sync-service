const os = require('os');
const path = require('path');
const fs = require('fs');
const path_base = path.resolve(os.homedir(), 'LocalDataSync');
if (!fs.existsSync(path_base)) fs.mkdirSync(path_base);
const log_path = path.resolve(os.homedir(), 'LocalDataSync/log.txt');
const error_path = path.resolve(os.homedir(), 'LocalDataSync/error.txt');

module.exports.formatDate = function (date, fmt) {
    if (!date && !fmt) date = 'yyyy-MM-dd hh:mm:ss';
    if (!fmt && typeof date === 'string') {
        date = new Date();
        fmt = date;
    }
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

module.exports.log = function (...arg) {
    console.info.apply(this, arg);
    fs.writeFileSync(log_path, arg.join(' ') + '\n');
};

module.exports.error = function (...arg) {
    console.info.apply(this, arg);
    fs.writeFileSync(error_path, arg.join(' ') + '\n');
};


console.log = module.exports.log;
console.error = module.exports.error;