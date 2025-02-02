const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, async (id, password, done) => {
        try {
            // .env 파일에서 저장된 아이디와 비밀번호 가져오기
            const loginSuccess = (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD);
            if (loginSuccess) {
                const admin = {ADMIN_ID: id, ADMIN_PASSWORD: password}
                done(null, admin);
            } else {
                done(null, false, { message: '로그인 실패.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};