const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const db = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

router.post('/', isNotLoggedIn, async (req, res, next) => {    // 회원가입
    try {
        // 가입 이메일 중복 검사
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (exUser) {
            return res.status(403).json({
                errorCode: 1,
                message: '이미 회원가입 되어있습니다.'
            })
        }

        const hash = await bcrypt.hash(req.body.password, 12)   // 비밀번호 암호화
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname
        })

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err)
                return next(err)
            }
            if (info) {
                return res.status(401).json({
                    errorCode: 2,
                    message: info.reason
                })
            }
    
            // 세션에 사용자 정보를 저장 (serializeUser를 이용해서!)
            return req.login(user, async (err) => {
                if (err) {
                    console.error(err)
                    return next(err)
                }
    
                // response data로 로그인 한 유저 정보를 클라이언트에 보낸다.
                // 자동으로 passport는 쿠키 값 또한 보낸다.
                return res.json(user)
            })
        })(req, res, next)

        return res.status(201).json(newUser)
    } catch (err) {
        console.error(err)
        return next(err)    // next에 인자 담으면 에러로 응답
    }
})

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    // ./passport/localStratege.js에서 export한 함수 실행 후 return한 값 콜백으로 받는다.
    // 특히 passport가 알아서 req 객체를 참조한다.
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason)
        }

        // 세션에 사용자 정보를 저장 (./passport/index.js의 serializeUser를 이용해서!)
        return req.login(user, async (err) => {
            if (err) {
                console.error(err)
                return next(err)
            }

            // response data로 로그인 한 유저 정보를 클라이언트에 보낸다.
            // 자동으로 passport는 쿠키 값 또한 보낸다.
            return res.json(user)
        })
    })(req, res, next)
})

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout()    // passport가 알아서 클라이언트 측의 쿠키 정보를 뽑아내 메모리 상의 key를 찾아 지워준다.
    req.session.destroy()
    return res.status(200).send('로그아웃 되었습니다.')
})

module.exports = router