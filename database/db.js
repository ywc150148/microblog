// 连接数据库
var mongoose = require('mongoose'),
    url = "mongodb://localhost:27017/microblog";

mongoose.Promise = global.Promise;

mongoose.connect(url, {
    useNewUrlParser: true
});

mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

mongoose.connection.on("open", function () {
    console.log("----\r\n数据库连接成功！\r\n----");
});

// module.exports = mongoose;
module.exports = {
    secret: 'blog123321', // 加密字符串
    url: url, // 数据库地址
    host: 'localhost',
};