var userModel = require('../database/userModel'),
    crypto = require('crypto'),
    mongoose = require('mongoose');

module.exports = model;

function model() {}

// 获取用户信息，需要name，password，返回 err result
model.prototype.getUser = function getUser(user, callback) {
    
    if (!this.notNull(user) || !this.notNull(user.name) || !this.notNull(user.password)) {
        return callback(false, null);
    }
    userModel.findOne({
        name: user.name,
        password: user.password
    }, function (err, result) {
        // if (err) return callback(err, null)
        // if (!result) return callback(false, null)
        return callback(err, result);
    });
}

// 用户验证，需要name，password，返回 true || fasle
model.prototype.isUser = function isUser(user, callback) {
    this.getUser(user, function (err, result) {
        var s = err || !result ? false : true;
        return callback(s);
    });
}

// 查询用户信息，需要name，返回 err result
model.prototype.findOne = function findOne(name, callback) {
    if (!this.notNull(name)) return callback("请输入用户名！", null);
    userModel.findOne({
        name: name
    }, function (err, result) {
        return callback(err, result);
    });
}

//生成口令的散列值，需要password
model.prototype.createHash = function (password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password, 'utf-8').digest('hex');
}

// 保存数据返回结果，需要name，password
model.prototype.save = function (user, callback) {
    const that = this;
    if (!this.notNull(user)) return callback("请输入用户名和密码！", null);

    this.findOne(user.name, function (err, result) {

        if (err || result) {
            return callback(err || "用户已存在！", null);
        } else if (!that.notNull(user.password) || user.password.length < 1) {
            return callback("密码不能为空！", null);
        } else {
            var newUser = new userModel({
                name: user.name,
                password: that.createHash(user.password)
            });

            // 保存
            newUser.save(function (err, result) {
                if (err || result === null) {
                    return callback(err || "注册失败！", null);
                } else {
                    return callback(err, result);
                }
            });
        }
    });
}

// 根据id查找数据
model.prototype.findById = function (id, callback) {
    userModel.findById({
        "_id": mongoose.Types.ObjectId(id)
    }, function (err, result) {
        if (err || !result) {
            return callback(err || "没有数据！", null);
        }
        return callback(err, result);
    })
}

// 查找所有数据
model.prototype.findAll = function (callback) {
    userModel.find(function (err, result) {
        console.log('result',result)
        return callback(err, result);
    });
}

// 查询数据
model.prototype.find = function (obj, callback) {
    userModel.find(obj, function (err, result) {
        return callback(err, result);
    });
}

// 修改数据
model.prototype.updateOne = function (old, newobj, callback) {
    // User.update({ userName: "oldname" }, { "$set": { userName: "newname" } }, function (err, doc) {});
    userModel.updateOne(old, newobj, function (err, result) {
        return callback(err, result);
    });
}

// 删除数据
model.prototype.remove = function (obj, callback) {
    userModel.remove(obj, function (err) {
        return callback(err);
    });
}

// 判断变量类型
model.prototype.notNull = function notNull(obj) {
    return Object.prototype.toString.call(obj) === "[object Null]" || Object.prototype.toString.call(obj) === "[object Undefined]" ? false : true;
}

// 判断变量类型
model.prototype.checkSession = function notNull(session) {
    return this.notNull(session)?true:false;
}
