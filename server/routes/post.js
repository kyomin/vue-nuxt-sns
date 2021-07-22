const express = require('express')
const multer = require('multer')
const path = require('path')
const { isLoggedIn } = require('./middlewares')

const router = express.Router()
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads')
        },
        filename(req, file, done) {
            /* 
                file.originalname : test.png
                ext : .png
                basename : test
            */
            const ext = path.extname(file.originalname)
            const basename = path.basename(file.originalname, ext)

            // 파일명 중복 방지를 위해 밀리세컨드 단위인 시간을 붙여준다.
            done(null, basename + Date.now() + ext)
        }
    }),
    limit: { fileSize: 20 * 1024 * 1024 }   // 20MB (1KB = 1024 = 2^10)
})
router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    /* 
        isLoggedIn로 인증 후, 
        upload.array('image')로 폼 데이터 해석해 req 객체에 files라는 속성에 추가한 후
        여기 콜백으로 빠진다.
    */
    console.log('req.files : ', req.files)

    // 프론트에 잘 도착했다고 현재 시간을 섞어 만든 파일명으로 응답해 준다.
    res.json(req.files.map(v => v.filename))
})

router.post('/', isLoggedIn, (req, res) => {

})

module.exports = router