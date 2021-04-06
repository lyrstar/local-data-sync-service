const os = require('os');
const path = require('path');
const fs = require('fs');
const {formatDate} = require('./util');
const path_base = path.resolve(os.homedir(), 'LocalDataSync');
const path_data = path.resolve(os.homedir(), 'LocalDataSync/data');
console.log(path_data)
if (!fs.existsSync(path_base)) fs.mkdirSync(path_base);
if (!fs.existsSync(path_data)) fs.mkdirSync(path_data);


module.exports.getDataDir = function () {
    return path_data;
}

module.exports.getList = function ({domain}) {
    let domain_path = path.resolve(path_data, domain);
    if (!fs.existsSync(domain_path)) fs.mkdirSync(domain_path);
    return fs.readdirSync(domain_path);
}

module.exports.getData = function (key, date, {domain}) {
    let domain_path = path.resolve(path_data, domain);
    if (!fs.existsSync(domain_path)) throw Error('data fail!')
    let file_name = key + '_' + formatDate(new Date(date), 'yyyyMMdd-hhmmss') + '.ld';
    return fs.readFileSync(path.resolve(domain_path, file_name), 'utf8');
}

module.exports.saveData = function (key, value, {domain}) {
    let domain_path = path.resolve(path_data, domain);
    if (!fs.existsSync(domain_path)) fs.mkdirSync(domain_path);
    let file_name = key + '_' + formatDate(new Date(), 'yyyyMMdd-hhmmss') + '.ld';
    fs.writeFileSync(path.resolve(domain_path, file_name), value);
    return file_name;
}