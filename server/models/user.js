module.exports = (sequelize, DataTypes) => {
    /* 
        User라는 테이블을 정의하고,
        각 컬럼 속성을 정의한다.

        여기서 테이블의 틀을 잡는 것이다.

        보통 모델명은 첫 글자 대문자의 단수형을 쓰게 되고,
        이로 인해 DB 서버에 만들어지는 테이블명은 Users의 복수형으로 변환된다.
    */
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING(40), // 40자 이내
            allowNull: false,    // 필수
            unique: true    // 중복 금지
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci'  // 한글 저장 가능
    })

    // 관계형 데이터베이스에서 테이블 간의 연관관계를 서술한다.
    User.associate = (db) => {
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment)
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' })  // 여러 게시물에 좋아요 누르는 경우. hasMany와 중복 id 갖는거 처리한다.
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' })   // 외래키의 followingId는 나의 ID이고, 이를 통해 나를 팔로워하는 사람들을 가져오겠다는 의미이다.
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' })
    }

    return User
}