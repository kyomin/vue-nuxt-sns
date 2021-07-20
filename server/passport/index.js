const passport = require('passport')
const db = require('../models')
const local = require("./localStrategy")

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id)  // 메모리를 경량화하기 위해 사용자의 id만 저장한다.
    }),
    // 로그인 후 모든 요청에 대해 이것이 실행된다.
    // 그리고 user 정보가 request 객체에 실려, 서버에서는 req.user로 인증된 유저 정보를 사용할 수 있게 된다.
    passport.deserializeUser(async (id, done) => {  
        try {
            const user = await db.User.findOne({ where: { id } })
            return done(null, user) // req.user, req.isAuthenticated() === true
        } catch (err) {
            console.error(err)
            return done(err)
        }
    })
    local()
}