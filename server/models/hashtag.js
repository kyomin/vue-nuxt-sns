module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    })

    Hashtag.associate = (db) => {
        /* 
            하나의 해시태그는 여러 포스트에 속할 수 있다.
            그리고 다대다 관계에서 중간 테이블을 둬서 각각의 PK를 저장해 참조하기 쉽게 만드는데,
            아래 예시는 중간 테이블을 PostHashtag로 둔 것이다.
        */
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' })
    }
    
    return Hashtag
}