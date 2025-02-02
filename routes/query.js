const express = require('express');
const { isLoggedIn } = require('../middlewares');
const executeQuery = require('../db');

const router = express.Router();

// POST /execute-query
router.post('/', isLoggedIn, async (req, res) => {
    console.log(req.body);

    const query = req.body.query.trim().toUpperCase();  // 쿼리 문자열을 대문자로 변환
    console.log(query)
    // SELECT 외의 SQL 명령어가 포함되어 있는지 확인
    const forbiddenCommands = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE'];

    // 쿼리에서 SELECT를 제외한 다른 명령어가 있으면 실행 금지
    if (forbiddenCommands.some(command => query.includes(command))) {
        return res.status(400).json({ message: '경고: 데이터베이스 조작 명령어는 허용되지 않습니다.' });
    }
    // 허용된 쿼리만 실행
    try {
        await executeQuery(req, res);
    } catch (error) {
    
        res.status(501).json({ message: '내부 서버 에러.' });
    }
});

module.exports = router;
