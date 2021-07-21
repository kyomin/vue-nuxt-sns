module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,   // 길이를 딱히 특정할 수 없는 매우 긴 글
            allowNull: false
        }
    }, {
        charset: 'utf8mb4',     // mb4 : 이모티콘까지 허용하겠다.
        collate: 'utf8mb4_general_ci'
    })

    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User)
        db.Comment.belongsTo(db.Post)
    }
    
    return Comment
}