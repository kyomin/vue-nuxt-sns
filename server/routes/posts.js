const express = require('express')

const db = require('../models')

const router = express.Router()

router.get('/', async (req, res, next) => {     // GET /posts?offset=10&limit=10
    try {
        console.log('GET /posts')
        const posts = await db.Post.findAll({
            raw: true,      // dataValues만 추출되게
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }],
            order: [['createdAt', 'DESC']],
            offset: parseInt(req.query.offset, 10) || 0,   // 시작 점 pointer (실무에선 생성, 삭제가 빈번히 일어나므로 잘 안 쓴다)
            limit: parseInt(req.query.limit, 10) || 0      // 가져올 개수
        })

        console.log('posts : ', posts)

        return res.json(posts)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router