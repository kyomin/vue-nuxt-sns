const express = require('express')

const db = require('../models')

const router = express.Router()

router.get('/', async (req, res, next) => {     // GET /posts?offset=10&limit=10(params가 아닌, query 속성에 담겨온다)
    try {
        console.log('GET /posts')
        const posts = await db.Post.findAll({
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image
            }, {
                model: db.User,
                as: 'Likers',    // 이를 통해 User 테이블을 구분 짓는다.
                attributes: ['id']
            }, {
                model: db.Post,  // 리트윗한거면 원본도 가져와 준다.
                as: 'Retweet',       
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname']
                }, {
                    model: db.Image
                }]
            }],
            order: [['createdAt', 'DESC']],
            offset: parseInt(req.query.offset, 10) || 0,   // 시작 점 pointer (실무에선 생성, 삭제가 빈번히 일어나므로 잘 안 쓴다)
            limit: parseInt(req.query.limit, 10) || 0      // 가져올 개수
        })

        return res.json(posts)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router