const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const bcrypt = require('bcrypt')
const db = require('../models')

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',     // req.body.email
        passwordField: 'password'   // req.body.password
    }, async (email, password, done) => {
        try {
            const exUser = await db.User.findOne({ where: { email } })
            if (!exUser) {  // DB에 없는 회원일 경우
                // first: 에러, second: 성공, third: 실패
                return done(null, false, { reason: '존재하지 않는 사용자입니다.' })
            }

            // 사용자가 DB에 등록돼 있으면 비밀번호 검증
            // first: plain password, second: bcrypted password
            const result = await bcrypt.compare(password, exUser.password)
            if (result) {
                return done(null, exUser)
            } else {
                return done(null, false, { reason: '비밀번호가 틀립니다.' })
            }
        } catch (err) {
            console.error(err)
            return done(err)
        }
    }))
}