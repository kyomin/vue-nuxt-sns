const express = require('express')

const db = require('../models')

const router = express.Router()

router.get('/:tag', async (req, res, next) => {     // GET /hashtag/:tag?offset=10&limit=10(params가 아닌, query 속성에 담겨온다)
    try {
        // DB 쿼리문의 조건을 분기 처리한다. 
        let where = {}
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    // lt(미만), lte(이하), gt(초과), gte(이상), ne(불일치), in, nin 등등
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)    // less than(id 값은 증가할 수록 최신 게시글이므로)
                }
            }
        }

        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) } // 한글 처리
            }, {
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
            limit: parseInt(req.query.limit, 10) || 0      // 가져올 개수
        })

        return res.json(posts)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router