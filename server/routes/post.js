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

/* 이미지 저장 */
router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    /* 
        isLoggedIn로 인증 후, 
        upload.array('image')로 폼 데이터 해석해 req 객체에 files라는 속성에 추가한 후
        여기 콜백으로 빠진다.
    */

    // 프론트에 잘 도착했다고 현재 시간을 섞어 만든 파일명으로 응답해 준다.
    res.json(req.files.map(v => v.filename))
})

/* 게시글 등록 */
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

        // 이미지가 담겨 왔다면
        if (req.body.image) {
            /* 
                하나만 담겨올 경우, 배열 타입이 아니라 문자열만 전달되는 버그가 있을 수 있다.
                이것을 예외처리하여 DB에 담는 작업이다.
            */
            if (Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id })
                }))
            } else {
                await db.Image.create({ src: req.body.image, PostId: newPost.id })
            }
        }

        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,     // 참조 관계에 있는 User 테이블에서
                attributes: ['id', 'nickname']      // 해당 속성만 가져와서 포함 시킨다.
            }, {
                model: db.Image     // 참조 관계에 있는 Image 정보를 가져온다(일대다이므로 배열로 가져온다).
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id']
            }]
        })

        return res.json(fullPost)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 특정 게시글 하나 불러오기 */
router.get('/:id', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
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
            }]
        })

        return res.json(post)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시들 코멘트 작성 */
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {     // :id => 동적으로 변할 수 있는 부분. params.id로 접근
    try {
        // 예외 처리!
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        if (!post) {
            return res.status(404).send('해당 게시글이 존재하지 않습니다.')
        }

        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content
        })

        const resComment = await db.Comment.findOne({
            where: {
                id: newComment.id
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }]
        })

        return res.json(resComment)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시글에 달린 코멘트 불러오기 */
router.get('/:id/comments', async (req, res, next) => {
    try {
        // 예외 처리!
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        if (!post) {
            return res.status(404).send('해당 게시글이 존재하지 않습니다.')
        }

        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }],
            order: [['createdAt', 'ASC']]
        })

        res.json(comments)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시글 삭제 */
router.delete('/:id', async (req, res,next) => {
    try {
        await db.Post.destroy({
            where: {
                id: req.params.id
            }
        })

        res.send('해당 게시글을 삭제했습니다.')
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시글 리트윗하기 */
router.post('/:id/retweet', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet'   // 리트윗한 게시글이면 원본 게시글이 됨
            }]
        })

        if (!post) {
            return res.status(404).send('게시글이 존재하지 않습니다.')
        }

        // 자신의 글을 리트윗하는 경우는 막는다 || 원본이 내 게시글인 경우도 막는다.
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.')
        }

        const retweetTargetId = post.RetweetId || post.id
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId
            }
        })
        if (exPost) {
            return res.status(403).send('이미 리트윗했습니다.')
        }
        
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,     // 원본 아이디
            content: 'retweet'
        })
        
        const retweetWithPrevPost = await db.Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Post,
                as: 'Retweet',       // 원본 table alias. Post 객체를 이 속성에 담는다.
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname']
                }, {
                    model: db.Image
                }]
            }]
        })
        res.status(201).json(retweetWithPrevPost)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시글 좋아요 */
router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        if (!post) {
            return res.status(404).send('게시글이 존재하지 않습니다.')
        }
        await post.addLiker(req.user.id)
        res.status(201).json({ userId: req.user.id })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 게시글 좋아요 취소 */
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } })
        if (!post) {
            return res.status(404).send('게시글이 존재하지 않습니다.')
        }

        await post.removeLiker(req.user.id)
        res.status(200).json({ userId: req.user.id })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router