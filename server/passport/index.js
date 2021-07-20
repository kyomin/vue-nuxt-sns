const passport = require('passport')

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id)  // 메모리를 경량화하기 위해 사용자의 id만 저장한다.
    }),
    passport.deserializeUser(() => {

    })
}