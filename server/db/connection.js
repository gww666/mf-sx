const mysql = require("mysql2");
const redis = require("redis");
//配置信息
const config = {
    mysql: {
        host: "127.0.0.1",
        user: "root",
        password: "123",
        database: "mf",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    redis: {

    }
} 
let pool = null;
const getDB = () => {
    return new Promise(async resolve => {
        if (pool) {
            resolve(pool);
        } else {
            pool = mysql.createPool(config.mysql);
            pool = pool.promise();
            resolve(pool);
        }
    });
}

const getRedis = () => {
    return redis.createClient();
}

module.exports = {
    getDB,
    getRedis
}
