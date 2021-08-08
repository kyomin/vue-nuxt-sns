const dotenv = require('dotenv')

dotenv.config()   // .env 파일로부터 개발자가 셋팅한 환경변수를 가져올 수 있다.

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue_sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue_sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue_sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}