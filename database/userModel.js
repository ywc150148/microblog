var mongoose = require('mongoose'),
moment = require('moment')

// 定义模式
var UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    regDate: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    lastLogin: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    latestlogin: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
});

// 将模式“编译”模型
var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;