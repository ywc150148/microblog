var md = require('./model'),
    Model = new md();

// 路由守卫 以下方法在路由中使用
module.exports = {
    //是否登录
    checkLogin: function (req, res, next) {
        Model.isUser(req.session.user, function (bool) {
            if (!bool) {
                req.flash('error', '需要登录才可以访问。');
                return res.redirect('/');
            }
            next();
        })
    },
    // 是否未登录
    checkNotLogin: function (req, res, next) {
        Model.isUser(req.session.user, function (bool) {
            if (bool) {
                req.flash('error', '已经是登录状态。');
                return res.redirect('/');
            }
            next();
        })
    },
    // 获取用户信息
    getUser: function (user, callback) {
        Model.getUser(user, function (err, res) {
            callback(err, res)
        })
    },
    // 检查session是否过期
    checkSession: function (req, res, next) {
        if (!Model.notNull(req.session.user)) {
            req.flash('error', '需要登录才可以访问。');
            return res.redirect('/');
        }
        next();
    }
}