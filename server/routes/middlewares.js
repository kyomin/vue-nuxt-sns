exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        /* 
            인수를 주지 않았을 경우 : 다음 미들웨어로 넘어간다.
            인수를 주었을 경우 : 에러 처리로 넘어간다.
        */
        return next()   
    }

    return res.status(401).send('로그인이 필요합니다.')
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    }

    return res.status(401).send('로그인한 사람은 이용할 수 없습니다.')
}