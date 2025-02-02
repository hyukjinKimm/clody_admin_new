const passport = require('passport');

exports.loginPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clody 어드민 페이지</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f3f4f6, #d1d5db);
          font-family: Arial, sans-serif;
        }
        .login-container {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        h2 {
          color: #333;
        }
        label {
          font-weight: bold;
          display: block;
          margin-top: 10px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px;
          width: 100%;
          margin-top: 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover {
          background: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>Clody 어드민</h2>
        <form action="/login" method="POST">
          <label for="id">ID</label>
          <input type="text" id="id" name="id" required>

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>

          <button type="submit">로그인</button>
        </form>
      </div>
    </body>
    </html>
  `);
};
  

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/console');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

