const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const cookie = require('cookie-parser')
const morgan = require('morgan')

const db = require('./models')
const passportConfig = require('./passport')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')

const port = 3085       // allocate port number
const app = express()   // make express app
db.sequelize.sync()     // database connection
passportConfig()        // for login auth


/* express 미들웨어 등록 */
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true   // 서로 간에 쿠키를 주고받을 수 있도록 설정
}))
app.use('/', express.static('uploads'))     // 정적 파일 경로 미들웨어로 등록. 이제 클라이언트에서는 '/파일명'으로 사진 파일에 접근 가능하다.
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
app.use(passport.initialize())  // 이 미들웨어에서 request 객체에 login과 logout을 넣어줌
app.use(passport.session())



/* express 라우터 미들웨어 등록 */
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/posts', postsRouter)



/* Create Server */
app.get('/', (req, res) => {
    res.send('Welcome to KyoSNS Server')
})

app.listen(port, () => {
    console.log(`백엔드 서버 ${port}번 포트에서 열림`)
})