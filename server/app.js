const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const cookie = require('cookie-parser')
const morgan = require('morgan')

/* make express app */
const app = express()

/* database connection */
const db = require('./models')
db.sequelize.sync()

/* for login auth */
const passportConfig = require('./passport')
passportConfig()

/* express 미들웨어 등록 */
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true   // 서로 간에 쿠키를 주고받을 수 있도록 설정
}))
app.use(cookie('cookiesecret'))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
    cookie: {
        httpOnly: true,
        secure: false
    }
}))
app.use(passport.initialize())  // request 객체에 login과 logout을 넣어줌
app.use(passport.session())

app.get('/', (req, res) => {
    res.send('안녕 Node.js')
})

app.post('/user', async (req, res, next) => {
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

/* 
    로그인을 하면 서버는 쿠키 값을 key로 로그인 정보를 저장한다.
    그리고 클라이언트로 이 값을 응답으로 보내준다.
    그러면 이제 클라이언트는 쿠키에 인증을 위한 key를 갖고 있다.
    그래서 수시로 백엔드로 요청 시 헤더에 이 정보를 담아 보내준다.
    백엔드는 요청에서 이 값을 꺼내, 메모리에 상주하는 객체에 매핑해 찾아 유효한지 검사한다.

    다음은
    해시 키 값 : 아이디로 매핑한 예시이다.
    실제 passport는 이렇게 간단히 저장하지는 않는다. 
    어디까지나 예시이다.
*/
const user = {
    'asffdsasdsadsa' : 1,
    'ggfdgfdhgfhgfh' : 2
}
app.post('/user/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason)
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
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 열림`)
})