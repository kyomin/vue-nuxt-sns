const express = require('express')
const multer = require('multer')
const path = require('path')
const db = require('../models')
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

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g)
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id
        })
        
        if (hashtags) {
            // Promise.all로 배열 각각에 대한 비동기를 병렬로 처리
            // 이로 인해 가장 긴 비동기 시간이 걸리는 최종 시간이다.
            // 직렬로 처리할 시 수행 시간은 모든 비동기를 기다리므로 다 더한 값이 되니까 시간 단축이 된다.
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({   // 찾으면 저장 X. 있는 경우에만 저장하기
                where: { name: tag.slice(1).toLowerCase() }
            })))

            // 다대다 관계를 형성하면서 시퀄라이즈가 동시에 addHashtags 함수를 정의해 준 것이다.
            await newPost.addHashtags(result.map(r => r[0]))
        }

        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,     // 참조 관계에 있는 User 테이블에서
                attributes: ['id', 'nickname']      // 해당 속성만 가져와서 포함 시킨다.
            }]
        })

        return res.json(fullPost)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router