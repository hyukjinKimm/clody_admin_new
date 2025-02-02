require('dotenv').config();
const { Client } = require('pg');

async function executeQuery(req, res) {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });
  
    try {
        await client.connect();
        const result = await client.query(req.body.query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "SQL 문법 에러" });
    } finally {
        await client.end();
    }
}
module.exports = executeQuery 