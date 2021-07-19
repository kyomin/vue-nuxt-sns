module.exports = (sequelize, DataTypes) => {
    /* 
        User라는 테이블을 정의하고,
        각 컬럼 속성을 정의한다.

        여기서 테이블의 틀을 잡는 것이다.
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

    User.associate = (db) => {

    }

    return User
}