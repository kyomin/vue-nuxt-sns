const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const cookie = require('cookie-parser')
const morgan = require('morgan')
const hpp = require('hpp')
const helmet = require('helmet')
const dotenv = require('dotenv')

const db = require('./models')
const passportConfig = require('./passport')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const hashtagRouter = require('./routes/hashtag')

const prod = process.env.NODE_ENV === 'production'
const dev_port = 3085       // allocate port number
const app = express()   // make express app
// db.sequelize.sync({ force: true })  // 모델(table) 구조 수정 시 강제 적용. 테이블 지웠다가 다시 만듦.
db.sequelize.sync()     // database connection
passportConfig()        // for login auth
dotenv.config()

/* 
    express 미들웨어 등록 
    배포와 개발 환경에 따라 등록하는 미들웨어가 다르다.
*/
if (prod) {     // 배포 환경
    console.log('현재 서버는 배포 환경에서 돌아갑니다.')
    app.use(helmet())
    app.use(hpp())
    app.use(morgan('combined'))
    app.use(cors({
        origin: 'http://www.kyosns.ml',
        credentials: true   // 서로 간에 쿠키를 주고받을 수 있도록 설정
    }))
} else {        // 개발 환경
    console.log('현재 서버는 개발 환경에서 돌아갑니다.')
    app.use(morgan('dev'))
    app.use(cors({
        origin: 'http://localhost:3080',
        credentials: true   // 서로 간에 쿠키를 주고받을 수 있도록 설정
    }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static('uploads'))     // 정적 파일 경로 미들웨어로 등록. 이제 클라이언트에서는 '/파일명'으로 사진 파일에 접근 가능하다.
app.use(cookie(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: prod && '.kyosns.ml'
    }
}))
app.use(passport.initialize())  // 이 미들웨어에서 request 객체에 login과 logout을 넣어줌
app.use(passport.session())



/* express 라우터 미들웨어 등록 */
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/hashtag', hashtagRouter)



/* Create Server */
app.get('/', (req, res) => {
    res.send('Welcome to KyoSNS Server')
})

app.listen(prod ? process.env.PORT : dev_port, () => {
    console.log(`백엔드 서버 배포 환경에서 ${prod ? process.env.PORT : dev_port}번 포트에서 열림`)
    console.log('process.env.NODE_ENV : ', process.env.NODE_ENV)
    console.log('process.env.PORT : ', process.env.PORT)
})