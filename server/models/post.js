module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,   // 길이를 딱히 특정할 수 없는 매우 긴 글
            allowNull: false
        }   // createdAt, updatedAt은 시퀄라이즈가 자동 생성하는 컬럼
    }, {
        charset: 'utf8mb4',     // mb4 : 이모티콘까지 허용하겠다.
        collate: 'utf8mb4_general_ci'
    })

    Post.associate = (db) => {
        db.Post.belongsTo(db.User)      // 이로 인해 UserId라는 컬럼 생성
        db.Post.hasMany(db.Comment)
        db.Post.hasMany(db.Image)
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' })   // Post - Like - User로 연결된 관계로부터 가져올 때에는 Likers라는 이름으로 구분지어 데이터를 조인한다!
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
        db.Post.belongsTo(db.Post, { as: 'Retweet' })   // 자기 자신 테이블을 참조한다(RetweetId 컬럼 생성).
    }
    
    return Post
}