const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')

/* make express app */
const app = express()

/* database connection */
const db = require('./models')
db.sequelize.sync({ force: true })  // 모델(table) 구조 수정 시 강제 적용. 테이블 지웠다가 다시 만듦.

/* express 미들웨어 등록 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors('http://localhost:3000'))

app.get('/', (req, res) => {
    res.send('안녕 Node.js')
})

app.post('/user', async (req, res, next) => {
    try {
        // 가입 이메일 중복 검사
        const exUser = await db.User.findOne({
            email: req.body.email
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

        return res.status(201).json(newUser)
    } catch (err) {
        console.error(err)
        return next(err)    // next에 인자 담으면 에러로 응답
    }
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 열림`)
})