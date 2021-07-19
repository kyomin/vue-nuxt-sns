const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')

/* make express app */
const app = express()

/* database connection */
const db = require('./models')
db.sequelize.sync()

/* express 미들웨어 등록 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors('http://localhost:3000'))

app.get('/', (req, res) => {
    res.send('안녕 Node.js')
})

app.post('/user', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12)   // 비밀번호 암호화
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname
        })

        res.status(201).json(newUser)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 열림`)
})