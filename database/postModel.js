var mongoose = require('mongoose'),
    moment = require('moment')

// 定义模式
var PostSchema = new mongoose.Schema({
    user_id: String,
    post: String,
    date: {
        type: String,
        default:moment().format('YYYY-MM-DD HH:mm:ss')
    }
});

// 将模式“编译”模型
module.exports = mongoose.model('PostModel', PostSchema);