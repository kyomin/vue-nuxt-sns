const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')

const db = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

/* 로그인 한 사용자 정보 불러오기 */
router.get('/', isLoggedIn, async (req, res, next) => {
    const user = req.user
    res.json(user)
})

/* 다른 특정 사용자 정보 불러오기 */
router.get('/:id', async (req, res, next) => {
    try {
        const user = await db.User.findOne({ 
            where: { id: parseInt(req.params.id, 10) },
            attributes: ['id', 'nickname'],
            include: [{
                model: db.Post,
                attributes: ['id']
            }, {
                model: db.User,
                as: 'Followings',
                attribute: ['id']
            }, {
                model: db.User,
                as: 'Followers',
                attribute: ['id']
            }]
        })

        return res.json(user)
    } catch (err) {
        console.error(err)
        return next(err)
    }
})

/* 회원가입 */
router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        // 가입 이메일 중복 검사
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email
            }
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

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err)
                return next(err)
            }
            if (info) {
                return res.status(401).json({
                    errorCode: 2,
                    message: info.reason
                })
            }
    
            // 세션에 사용자 정보를 저장 (serializeUser를 이용해서!)
            return req.login(user, async (err) => {
                if (err) {
                    console.error(err)
                    return next(err)
                }
    
                // response data로 로그인 한 유저 정보를 클라이언트에 보낸다.
                // 자동으로 passport는 쿠키 값 또한 보낸다.
                return res.json(user)
            })
        })(req, res, next)

        return res.status(201).json(newUser)
    } catch (err) {
        console.error(err)
        return next(err)    // next에 인자 담으면 에러로 응답
    }
})

/* 로그인 */
router.post('/login', isNotLoggedIn, async (req, res, next) => {
    // ./passport/localStratege.js에서 export한 함수 실행 후 return한 값 콜백으로 받는다.
    // 특히 passport가 알아서 req 객체를 참조한다.
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason)
        }

        // 세션에 사용자 정보를 저장 (./passport/index.js의 serializeUser를 이용해서!)
        return req.login(user, async (err) => {
            if (err) {
                console.error(err)
                return next(err)
            }

            // response data로 로그인 한 유저 정보를 클라이언트에 보낸다.
            // 자동으로 passport는 쿠키 값 또한 보낸다.
            return res.json(user)
        })
    })(req, res, next)
})

/* 로그아웃 */
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout()    // passport가 알아서 클라이언트 측의 쿠키 정보를 뽑아내 메모리 상의 key를 찾아 지워준다.
    req.session.destroy()
    return res.status(200).send('로그아웃 되었습니다.')
})

/* 다른 사람(특정 유저)의 게시글 불러오기 */
router.get('/:id/posts', async (req, res, next) => {
    try {
        let where = {
            UserId: parseInt(req.params.id, 10),
            RetweetId: null
        }
        console.log('req.query.lastId : ', req.query.lastId)
        if (req.query.lastId) {
            where['id'] = {
                [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)
            }
        }

        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id']
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

/* 팔로잉 */
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        })
        await me.addFollowing(req.params.id)
        return res.send(req.params.id) // 이래야 클라이언트 측 then으로 빠진다.
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 언팔로잉 */
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        })
        await me.removeFollowing(req.params.id)
        return res.send(req.params.id)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 팔로워(나를 팔로잉 하는 사람) 삭제 */
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id }
        })
        await me.removeFollower(req.params.id)
        return res.send(req.params.id)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 닉네임 변경 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await db.User.update({
            nickname: req.body.nickname
        }, {
            where: { id: req.user.id }
        })

        return res.send(req.body.nickname)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 팔로잉 목록 불러오기 */
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id }
        })

        // 시퀄라이즈가 맺어준 관계로, 내가 follow 하고 있는 유저 목록을 자동으로 불러와준다.
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10)
        })
        return res.json(followings)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

/* 팔로워 목록 불러오기 */
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id }
        })

        // 시퀄라이즈가 맺어준 관계로, 내가 follow 하고 있는 유저 목록을 자동으로 불러와준다.
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10)
        })
        return res.json(followers)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router